// Copyright 2019, University of Colorado Boulder

/**
 * View for a single slot that is on a vectorCreatorPanel. A slot creates a vector when the icon is clicked and allows
 * the user to drag the screen onto graph. If the user doesn't drag the vector onto the graph, animate the vector
 * back to the panel slot: https://github.com/phetsims/vector-addition/issues/50.
 *
 * Slots vary from screen to screen, slot to slot.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const FormulaNode = require( 'SCENERY_PHET/FormulaNode' );
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Node = require( 'SCENERY/nodes/Node' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionIconFactory = require( 'VECTOR_ADDITION/common/view/VectorAdditionIconFactory' );
  const VectorAdditionModel = require( 'VECTOR_ADDITION/common/model/VectorAdditionModel' );
  const VectorNode = require( 'VECTOR_ADDITION/common/view/VectorNode' );
  const VectorSet = require( 'VECTOR_ADDITION/common/model/VectorSet' );

  // constants
  const LABEL_AND_ICON_SPACING = 6;
  const LABEL_RESIZE_SCALE = 0.8;
  const ICON_OFFSET_MOUSE_AREA = 8;

  class VectorCreatorPanelSlot extends HBox {
    /**
     * @constructor
     * @param {VectorAdditionModel} vectorAdditionModel
     * @param {Vector2} initialVector - the initial vector's components, in model coordinates.
     * @param {Graph} graph - the graph to drop the vector onto
     * @param {VectorSet} vectorSet - the vectorSet that the slot adds vectors to.
     * @param {Node} vectorContainer - the container to add new vector nodes to (to keep vectors in a separate z-layer)
     * @param {ScreenView} parentScreenView - the screen view up the scene graph for the creator panel slot
     * @param {Object} [options]
     */
    constructor( vectorAdditionModel, initialVector, graph, vectorSet, vectorContainer, parentScreenView, options ) {

      assert && assert( vectorAdditionModel instanceof VectorAdditionModel,
        `invalid vectorAdditionModel: ${vectorAdditionModel}` );
      assert && assert( initialVector instanceof Vector2, `invalid initialVector: ${initialVector}` );
      assert && assert( graph instanceof Graph, `invalid graph: ${graph}` );
      assert && assert( vectorSet instanceof VectorSet, `invalid vectorSet: ${vectorSet}` );
      assert && assert( vectorContainer instanceof Node, `invalid vectorContainer: ${vectorContainer}` );
      assert && assert( parentScreenView instanceof ScreenView, `invalid parentScreenView: ${parentScreenView}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype,
        `Extra prototype on Options: ${options}` );

      //----------------------------------------------------------------------------------------

      options = _.extend( {
        label: null, // {string|null} the label for the vector at the slot
        isInfinite: false, // {boolean} true means the slot will regenerate vectors to be dragged
        labelIconSpacing: LABEL_AND_ICON_SPACING,
        iconOptions: null,
        arrowIconContainerWidth: 35, // {number} the fixed size of the container containing the icon
        xMargin: 0
      }, options );

      //----------------------------------------------------------------------------------------

      super( {
        spacing: options.labelIconSpacing,
        xMargin: options.xMargin
      } );

      //----------------------------------------------------------------------------------------

      // convenience variables
      const modelViewTransformProperty = graph.modelViewTransformProperty;
      const initialViewVector = modelViewTransformProperty.value.modelToViewDelta( initialVector );

      // Create an icon
      const iconNode = VectorAdditionIconFactory.createVectorCreatorPanelIcon( initialViewVector,
        vectorSet.vectorGroup,
        options.iconOptions );

      // Make the iconNode easier to grab
      iconNode.mouseArea = iconNode.shape.getOffsetShape( ICON_OFFSET_MOUSE_AREA );

      // Create a fixed size box for the icon, allowing the label to stay in the same spot
      this.addChild( new AlignBox( iconNode, {
        alignBounds: new Bounds2( 0, 0, options.arrowIconContainerWidth, iconNode.height ),
        xAlign: 'center',
        yAlign: 'center'
      } ) );

      // Add the label if provided
      if ( options.label ) {
        const label = new FormulaNode( `\\vec{\\mathrm{${options.label}}}` );
        label.scale( LABEL_RESIZE_SCALE );

        this.addChild( label );
      }

      //----------------------------------------------------------------------------------------
      // When the vector icon is clicked, create a new vector model
      //----------------------------------------------------------------------------------------
      iconNode.addInputListener( DragListener.createForwardingListener( ( event ) => {

        const globalPoint = parentScreenView.globalToLocalPoint( event.pointer.point );

        const vectorCenterPosition = modelViewTransformProperty.value.viewToModelPosition( globalPoint );

        // From the center, we can calculate where the tail would be based on the initialVector
        const vectorTailPosition = vectorCenterPosition.minus( initialVector.timesScalar( 0.5 ) );


        // Create the new Vector Model
        const vectorModel = vectorSet.createVector( vectorTailPosition, initialVector.x, initialVector.y, {
          label: options.label
        } );
        vectorSet.vectors.push( vectorModel );

        //----------------------------------------------------------------------------------------
        // Create the vector node and add it to the container
        const vectorNode = new VectorNode( vectorModel,
          graph,
          vectorAdditionModel.valuesVisibleProperty,
          vectorAdditionModel.angleVisibleProperty );
        vectorContainer.addChild( vectorNode );

        // Activate the body drag the body drag
        vectorNode.bodyDragListener.press( event, vectorNode );

        // Change the visibility to allow or not allow infinite slots
        iconNode.visible = options.isInfinite;

        //----------------------------------------------------------------------------------------
        // Add the removal listener for when the vector is removed to remove the node.
        const removalListener = removedVector => {
          if ( removedVector === vectorModel ) {
            removedVector.isOnGraphProperty.value = false;
            vectorNode.dispose();
            iconNode.visible = true;
            vectorSet.vectors.removeItemRemovedListener( removalListener );
          }
        };
        vectorSet.vectors.addItemRemovedListener( removalListener );

        //----------------------------------------------------------------------------------------
        // Observe when the vector node says its time to animate back.
        vectorNode.animateBackProperty.link( ( animateBack ) => {

          if ( animateBack ) {
            // Get the location of the icon node relative to the screen view
            const iconPosition = modelViewTransformProperty.value.viewToModelBounds(
              parentScreenView.boundsOf( iconNode ) ).center;

            const iconAttributesVector = modelViewTransformProperty.value.viewToModelDelta(
              new Vector2( iconNode.width, -iconNode.height ) );

            const animationFinishedListener = () => {

              iconNode.visible = true;

              // Remove the vector model
              vectorSet.vectors.remove( vectorModel );
              vectorModel.dispose();
            };
            vectorModel.animateToPoint( iconPosition, iconAttributesVector, animationFinishedListener );
          }
        } );

      }, {
        allowTouchSnag: true
      } ) );
    }
  }

  return vectorAddition.register( 'VectorCreatorPanelSlot', VectorCreatorPanelSlot );
} );