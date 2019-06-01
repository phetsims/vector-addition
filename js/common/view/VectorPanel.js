// Copyright 2019, University of Colorado Boulder

/**
 * Shows the panel with draggable vectors.
 *
 * @author Martin Veillette
 * */
define( require => {
  'use strict';

  // modules
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Panel = require( 'SUN/Panel' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorNode = require( 'VECTOR_ADDITION/common/view/VectorNode' );

  const VECTOR_BOX_OPTIONS = VectorAdditionConstants.VECTOR_BOX_OPTIONS;

  class VectorPanel extends Node {

    /**
     *
     */
    constructor( model, modelViewTransform ) {

      super();

      const content = [];

      const vectorLayer = new Node();
      model.vectors.forEach( vector => {
        const vectorNode = new VectorNode( vector, model.gridModelBounds, modelViewTransform, model.componentStyleProperty );

        vectorLayer.addChild( vectorNode );
        vectorNode.visible = false;

        const vectorIconNode = new ArrowNode( 0, 0, 30, 0 );

        content.push( vectorIconNode );
        const isVectorInPlayAreaProperty = new BooleanProperty( false );

        isVectorInPlayAreaProperty.link( inPlayArea => { vectorNode.visible = inPlayArea; } );

        // Capture image for icon
        initializeIcon( vectorIconNode, isVectorInPlayAreaProperty, event => {

          vectorNode.center = this.globalToParentPoint( event.pointer.point );

          // vectorArrow provided as targetNode in the DragListener constructor, so this press will target it
          vectorNode.bodyDragListener.press( event );

          isVectorInPlayAreaProperty.value = true;
        } );

      } );

      const box = new LayoutBox( {
        spacing: 20,
        children: content
      } );

      const panel = new Panel( box, VECTOR_BOX_OPTIONS );
      panel.right = 950;
      panel.top = 300;

      this.addChild( panel );
      this.addChild( vectorLayer );

    }

  }

  /**
   * Initialize the icon for use in the toolbox.
   * @param {Node} node
   * @param {BooleanProperty} inPlayAreaProperty
   * @param {Object} forwardingListener
   */
  const initializeIcon = ( node, inPlayAreaProperty, forwardingListener ) => {
    node.cursor = 'pointer';
    inPlayAreaProperty.link( inPlayArea => { node.visible = !inPlayArea; } );
    node.addInputListener( DragListener.createForwardingListener( forwardingListener ) );
  };

  return vectorAddition.register( 'VectorPanel', VectorPanel );
} )
;

