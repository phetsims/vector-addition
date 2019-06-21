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
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const FormulaNode = require( 'SCENERY_PHET/FormulaNode' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Property = require( 'AXON/Property' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2Property = require( 'DOT/Vector2Property' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorModel = require( 'VECTOR_ADDITION/common/model/VectorModel' );
  const VectorSet = require( 'VECTOR_ADDITION/common/model/VectorSet' );
  const VectorTypes = require( 'VECTOR_ADDITION/common/model/VectorTypes' );
  const VectorAdditionIconFactory = require( 'VECTOR_ADDITION/common/view/VectorAdditionIconFactory' );

  // constants
  const LABEL_AND_ICON_SPACING = 6;
  const LABEL_RESIZE_SCALE = 0.8;

  const GROUP_ONE_ICON_ARROW_OPTIONS = _.extend( {},
    VectorAdditionConstants.VECTOR_OPTIONS, {
      fill: VectorAdditionColors.VECTOR_GROUP_1_COLORS.fill
    } );
  const GROUP_TWO_ICON_ARROW_OPTIONS = _.extend( {},
    VectorAdditionConstants.VECTOR_OPTIONS, {
      fill: VectorAdditionColors.VECTOR_GROUP_2_COLORS.fill
    } );

  class VectorCreatorPanelSlot extends HBox {
    /**
     * @constructor
     * @param {Vector2} initialVector - the direction, and length of the modelVector
     * @param {Property.<ModelViewTransform2>} modelViewTransformProperty
     * @param {VectorSet} vectorSet - the vectorSet that the slot adds vectors to.
     * @param {Object} options
     */
    constructor( initialVector, modelViewTransformProperty, vectorSet, options ) {

      options = _.extend( {
        label: null, // {string|null} the label for the vector at the slot
        isInfinite: false, // {boolean} true means the slot will regenerate vectors to be dragged
        labelIconSpacing: LABEL_AND_ICON_SPACING
      }, options );

      // Type Check
      assert && assert( initialVector instanceof Vector2, `invalid initialVector: ${initialVector}` );
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
        spacing: options.labelIconSpacing
      } );

      //----------------------------------------------------------------------------------------

      const vectorType = vectorSet.vectorType;

      let arrowOptions;
      switch( vectorType ) {
        case VectorTypes.ONE:
          arrowOptions = GROUP_ONE_ICON_ARROW_OPTIONS;
          break;
        case VectorTypes.TWO:
          arrowOptions = GROUP_TWO_ICON_ARROW_OPTIONS;
          break;
        default:
          throw new Error( `Vector type ${vectorType} doesn't exists ` );
      }

      //----------------------------------------------------------------------------------------

      const initialViewVector = modelViewTransformProperty.value.modelToViewDelta( initialVector );

      // @private {Vector2}
      this.initialVector = initialVector;

      // @public (read-only) {Node}
      this.vectorRepresentationNode = new ArrowNode(
        0,
        0,
        initialViewVector.x,
        initialViewVector.y, arrowOptions );

      const iconNode = VectorAdditionIconFactory.createVectorCreatorPanelIcon(
        initialViewVector,
        vectorType );


      // Make the iconNode easier to grab
      iconNode.mouseArea = iconNode.shape.getOffsetShape( 8 );
      this.addChild( iconNode );


      if ( options.label ) {

        const label = new FormulaNode( `\\vec{\\mathrm{${options.label}}}` );
        label.scale( LABEL_RESIZE_SCALE );

        this.addChild( label );

      }

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
      iconNode.addInputListener( DragListener.createForwardingListener( ( event ) => {

          // Create a location property to track the location of where the user dragged the vector representation
          const vectorRepresentationLocationProperty = new Vector2Property(
            this.vectorRepresentationNode.globalToParentPoint( event.pointer.point ) );

          // Create a drag listener for the vector representation node
          const vectorRepresentationDragListener = new DragListener( {
            targetNode: this.vectorRepresentationNode,
            allowTouchSnag: true,
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
                  iconNode.visible = true;
                }
              } );
            }

          } );

          this.vectorRepresentationNode.addInputListener( vectorRepresentationDragListener );

          if ( !options.isInfinite ) {
            iconNode.visible = false;
          }

          this.vectorRepresentationNode.center = this.vectorRepresentationNode.globalToParentPoint( event.pointer.point );

          vectorRepresentationDragListener.press( event );
        },
        { allowTouchSnag: true } ) );

    }

    /**
     * Called when the vectorRepresentation is dropped. This should add the vector to the model.
     * @private
     * @param {Vector2} droppedPosition (model coordinates)
     * @returns {VectorModel} - the model added
     */
    addVectorToModel( droppedPosition ) {


      const options = ( this.label ) ? { label: this.label } : {};

      return this.vectorSet.addVector( droppedPosition, this.initialVector.x, this.initialVector.y, options );
    }
  }

  return vectorAddition.register( 'VectorCreatorPanelSlot', VectorCreatorPanelSlot );
} );