// Copyright 2019, University of Colorado Boulder

/**
 * View for a single slot that is on a vectorCreatorPanel.
 *
 * A slot creates a vector when the icon is clicked and allows the user to drag the screen onto graph.
 *
 * If the user doesn't drag the vector onto the graph, animate the vector
 * back to the panel slot: https://github.com/phetsims/vector-addition/issues/50.
 *
 * The vector creator panel differs from screen to screen in the following ways.
 *  - Different icon colors and sizes
 *  - Infinite slots versus only one vector per slot
 *  - Number of slots per panel
 *  - Having labels vs not having labels (called symbols)
 *  - Icon and initial vector components (i.e. on explore 1D the initial vector are horizontal/vertical) while
 *    on explore 2d the vectors are 45 degrees)
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
  const Vector = require( 'VECTOR_ADDITION/common/model/Vector' );
  const VectorNode = require( 'VECTOR_ADDITION/common/view/VectorNode' );
  const VectorSet = require( 'VECTOR_ADDITION/common/model/VectorSet' );

  // constants
  const LABEL_AND_ICON_SPACING = 6; // spacing between the label and the icon
  const LABEL_RESIZE_SCALE = 0.8; // the label is resized to 0.8
  const ICON_OFFSET_MOUSE_AREA = 8; // icon offset to make it easier to grab

  class VectorCreatorPanelSlot extends HBox {
    /**
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
        symbol: null, // {string|null} the symbol for the vector at the slot
        isInfinite: false, // {boolean} true means the slot will regenerate vectors to be dragged
        labelIconSpacing: LABEL_AND_ICON_SPACING, // {number} spacing between the label and the icon
        iconOptions: null, // {object} options passed to the icon. Defaults bellow.
        arrowIconContainerWidth: 35 // {number} the fixed size of the container containing the icon
      }, options );

      options.iconOptions = _.extend( {
        arrowSize: 30
      }, options.iconOptions );

      super( {
        spacing: options.labelIconSpacing
      } );

      //----------------------------------------------------------------------------------------

      // Convenience variables
      const modelViewTransformProperty = graph.modelViewTransformProperty;
      const initialViewVector = modelViewTransformProperty.value.modelToViewDelta( initialVector );

      // Create an icon
      const iconNode = VectorAdditionIconFactory.createVectorCreatorPanelIcon( initialViewVector,
        vectorSet.vectorGroup,
        options.iconOptions );

      // Get the components in model coordinates of the icon
      const iconComponents = modelViewTransformProperty.value.viewToModelDelta(
        initialViewVector.normalized().timesScalar( options.iconOptions.arrowSize ) );

      // Make the iconNode easier to grab
      iconNode.mouseArea = iconNode.shape.getOffsetShape( ICON_OFFSET_MOUSE_AREA );

      // Create a fixed size box for the icon, allowing the label to stay in the same spot
      this.addChild( new AlignBox( iconNode, {
        alignBounds: new Bounds2( 0, 0, options.arrowIconContainerWidth, iconNode.height ),
        xAlign: 'center',
        yAlign: 'center'
      } ) );

      // Add the label if a symbol was provided
      if ( options.symbol ) {
        const label = new FormulaNode( `\\vec{\\mathrm{${options.symbol}}}` );
        label.scale( LABEL_RESIZE_SCALE );

        this.addChild( label );
      }

      //----------------------------------------------------------------------------------------
      // When the vector icon is clicked, create a new vector model
      //----------------------------------------------------------------------------------------
      iconNode.addInputListener( DragListener.createForwardingListener( ( event ) => {

        // Get the model coordinates of where the icon was clicked
        const globalPoint = parentScreenView.globalToLocalPoint( event.pointer.point );
        const vectorCenterPosition = modelViewTransformProperty.value.viewToModelPosition( globalPoint );

        // From the center, we can calculate where the tail would be based on the initialVector
        const vectorTailPosition = vectorCenterPosition.minus( initialVector.timesScalar( 0.5 ) );

        // Create the new Vector Model
        const vector = new Vector( vectorTailPosition, initialVector, graph, vectorSet, options.symbol );
        vectorSet.vectors.push( vector );

        //----------------------------------------------------------------------------------------
        // Create the vector node and add it to the container
        const vectorNode = new VectorNode( vector,
          graph,
          vectorAdditionModel.valuesVisibleProperty,
          vectorAdditionModel.angleVisibleProperty );
        vectorContainer.addChild( vectorNode );

        // Activate the body drag
        vectorNode.bodyDragListener.press( event, vectorNode );

        // Change the visibility to allow or not allow infinite slots
        iconNode.visible = options.isInfinite;

        //----------------------------------------------------------------------------------------
        // Add the removal listener for when the vector is removed to remove the node.
        const removeVectorNodeListener = removedVector => {
          if ( removedVector === vector ) {
            removedVector.isOnGraphProperty.value = false;
            vectorNode.dispose();
            iconNode.visible = true;
            vectorSet.vectors.removeItemRemovedListener( removeVectorNodeListener );
          }
        };
        vectorSet.vectors.addItemRemovedListener( removeVectorNodeListener );

        //----------------------------------------------------------------------------------------
        // Observe when the vector node says its time to animate back.
        vectorNode.animateBackProperty.link( ( animateBack ) => {

          if ( animateBack ) {

            // Get the location of the icon node relative to the screen view
            const iconPosition = modelViewTransformProperty.value.viewToModelBounds(
              parentScreenView.boundsOf( iconNode ) ).center;

            // Create the listener to reset the slot when animation finished
            const animationFinishedListener = () => {
              iconNode.visible = true;

              // Remove the vector model
              vectorSet.vectors.remove( vector );
              vector.dispose();
            };
            vector.animateToPoint( iconPosition, iconComponents, animationFinishedListener );
          }
        } );

      }, {
        allowTouchSnag: true
      } ) );
    }
  }

  return vectorAddition.register( 'VectorCreatorPanelSlot', VectorCreatorPanelSlot );
} );