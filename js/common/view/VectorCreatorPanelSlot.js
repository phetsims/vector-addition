// Copyright 2019, University of Colorado Boulder

/**
 * View for a single slot that is on a vectorCreatorPanel. A slot should allow the user to drag a 'decoy' vector
 * on to the graph, in which this view will call an abstract method to add a vector to the model.
 *
 * Slots vary from screen to screen, slot to slot. This module requires:
 *  - Node for the icon
 *  - Node for the vectorRepresentation (the 'decoy icon')
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const FormulaNode = require( 'SCENERY_PHET/FormulaNode' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Property = require( 'AXON/Property' );
  const Vector2Property = require( 'DOT/Vector2Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorModel = require( 'VECTOR_ADDITION/common/model/VectorModel' );
  const VectorSet = require( 'VECTOR_ADDITION/common/model/VectorSet' );

  // constants
  const LABEL_AND_ICON_SPACING = 6;

  class VectorCreatorPanelSlot extends HBox {
    /**
     * @constructor
     * @param {Node} iconNode
     * @param {Node} vectorRepresentationNode
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty
     * @param {VectorSet} vectorSet - the vectorSet that the slot adds vectors to.
     * @param {Object} options
     */
    constructor( iconNode, vectorRepresentationNode, modelViewTransformProperty, vectorSet, options ) {

      options = _.extend( {
        label: null, // {string|null} the label for the vector at the slot
        isInfinite: false, // {boolean} true means the slot will regenerate vectors to be dragged
        labelIconSpacing: LABEL_AND_ICON_SPACING
      }, options );

      // Type Check
      assert && assert( iconNode instanceof Node, `invalid iconNode: ${iconNode}` );
      assert && assert( vectorRepresentationNode instanceof Node,
        `invalid vectorRepresentationNode: ${vectorRepresentationNode}` );
      assert && assert( modelViewTransformProperty instanceof Property
      && modelViewTransformProperty.value instanceof ModelViewTransform2,
        `invalid modelViewTransformProperty: ${modelViewTransformProperty}` );
      assert && assert( vectorSet instanceof VectorSet, `invalid vectorSet: ${vectorSet}` );
      assert && assert( !options.label || typeof options.label === 'string',
        `invalid options.label: ${options.label}` );
      assert && assert( typeof options.isInfinite === 'boolean', `invalid options.isInfinite: ${options.isInfinite}` );
      assert && assert( typeof options.labelIconSpacing === 'number' && options.labelIconSpacing > 0,
        `invalid options.labelIconSpacing: ${options.labelIconSpacing}` );

      //----------------------------------------------------------------------------------------

      super( {
        spacing: options.labelIconSpacing,
        children: [ iconNode ]
      } );

      if ( options.label ) {
        this.addChild( new FormulaNode( `\\vec{${options.label}}` ) );
      }

      // @public (read-only) {Node}
      this.iconNode = iconNode;

      // @public (read-only) {Node}
      this.vectorRepresentationNode = vectorRepresentationNode;

      //----------------------------------------------------------------------------------------

      // @public (read-only) {string|null}
      this.label = options.label;

      // @public (read-only) {boolean}
      this.isInfinite = options.isInfinite;

      // @public (read-only) {vectorSet}
      this.vectorSet = vectorSet;

      //----------------------------------------------------------------------------------------


      // Set the representation node to invisible
      this.vectorRepresentationNode.visible = false;

      // When the vector icon is clicked, add the vector representation as a decoy vector to drag onto the screen
      this.iconNode.addInputListener( DragListener.createForwardingListener( ( event ) => {

        // Create a location property to track the location of where the user dragged the vector representation
        const vectorRepresentationLocationProperty = new Vector2Property(
          this.vectorRepresentationNode.globalToParentPoint( event.pointer.point ) );

        // Create a drag listener for the vector representation node
        const vectorRepresentationDragListener = new DragListener( {
          targetNode: this.vectorRepresentationNode,
          translateNode: true,
          locationProperty: vectorRepresentationLocationProperty,
          start: () => { this.vectorRepresentationNode.visible = true; },
          end: () => {

            // TODO: what should we do if the user dragged it off the grid

            this.vectorRepresentationNode.visible = false;

            // Get the drag location in model coordinates
            const vectorRepresentationPosition = modelViewTransformProperty.value.viewToModelPosition(
              vectorRepresentationLocationProperty.value
            );

            // Call the abstract method to add the vector to the model. See addVectorToModel for documentation
            const newVectorModel = this.addVectorToModel( vectorRepresentationPosition );

            // Check that the new vector model was implemented correctly
            assert && assert( newVectorModel instanceof VectorModel,
              `this.addVectorToModel should return a VectorModel, not a ${newVectorModel}` );

            // Add a removed listener to the observable array to reset the icon
            this.vectorSet.vectors.addItemRemovedListener( ( removedVector ) => {
              if ( removedVector === newVectorModel ) {
                this.iconNode.visible = true;
              }
            } );
          }

        } );

        this.vectorRepresentationNode.addInputListener( vectorRepresentationDragListener );

        if ( !options.isInfinite ) {
          this.iconNode.visible = false;
        }

        this.vectorRepresentationNode.center = this.vectorRepresentationNode.globalToParentPoint( event.pointer.point );

        vectorRepresentationDragListener.press( event );
      } ) );

    }

    /**
     * Called when the vectorRepresentation is dropped. This should add the vector to the model.
     * @public
     * @abstract
     * @param {Vector2} - droppedPosition (model coordinates)
     * @returns {VectorModel} - the model added
     */
    addVectorToModel( droppedPosition ) { throw new Error( 'addVectorToModel must be implemented by sub classes' ); }

  }

  return vectorAddition.register( 'VectorCreatorPanelSlot', VectorCreatorPanelSlot );
} );