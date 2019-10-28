// Copyright 2019, University of Colorado Boulder

/**
 * Explore1DVectorCreatorPanel is a specialization of VectorCreatorPanel (the vector 'toolbox') for the 'Explore 1D' screen.
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const Explore1DGraph = require( 'VECTOR_ADDITION/explore1D/model/Explore1DGraph' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const merge = require( 'PHET_CORE/merge' );
  const SceneNode = require( 'VECTOR_ADDITION/common/view/SceneNode' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorCreatorPanel = require( 'VECTOR_ADDITION/common/view/VectorCreatorPanel' );
  const VectorCreatorPanelSlot = require( 'VECTOR_ADDITION/common/view/VectorCreatorPanelSlot' );

  class Explore1DVectorCreatorPanel extends VectorCreatorPanel {

    /**
     * @param {Explore1DGraph} graph
     * @param {SceneNode} sceneNode
     * @param {string[]} symbols - the symbols corresponding to each slot
     * @param {Object} [options]
     */
    constructor( graph, sceneNode, symbols, options ) {

      assert && assert( graph instanceof Explore1DGraph, `invalid graph: ${graph}` );
      assert && assert( sceneNode instanceof SceneNode, `invalid sceneNode: ${sceneNode}` );
      assert && assert( _.every( symbols, symbol => typeof symbol === 'string' ), `invalid symbols: ${symbols}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `Extra prototype on options: ${options}` );

      options = merge( {
        slotSpacing: ( graph.orientation === GraphOrientations.VERTICAL ) ? 18 : 32
      }, options );

      // Create the initial vector components, they are the same for every symbol.
      // See https://github.com/phetsims/vector-addition/issues/227
      const isHorizontal = ( graph.orientation === GraphOrientations.HORIZONTAL );
      const initialVectorComponents = isHorizontal ?  new Vector2( 5, 0 ) : new Vector2( 0, 5 );

      // Create a slot for each symbol
      const panelSlots = [];
      symbols.forEach( symbol => {
        panelSlots.push( new VectorCreatorPanelSlot( graph, graph.vectorSet, sceneNode, initialVectorComponents, {
          symbol: symbol,
          iconArrowMagnitude: 35,

          // pointer area dilation for icons, identical for mouseArea and touchArea,
          // see https://github.com/phetsims/vector-addition/issues/250
          iconPointerAreaXDilation: isHorizontal ? 10 : 20,
          iconPointerAreaYDilation: isHorizontal ? 15 : 5
        } ) );
      } );

      super( panelSlots, options );
    }
  }

  return vectorAddition.register( 'Explore1DVectorCreatorPanel', Explore1DVectorCreatorPanel );
} );