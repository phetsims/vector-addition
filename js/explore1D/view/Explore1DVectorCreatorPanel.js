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
  const SceneNode = require( 'VECTOR_ADDITION/common/view/SceneNode' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
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

      options = _.extend( {
        slotSpacing: ( graph.orientation === GraphOrientations.VERTICAL ) ? 22 : 28
      }, options );

      // Create the initial vector components
      const initialVectorComponents = ( graph.orientation === GraphOrientations.VERTICAL ) ?
                                      new Vector2( 0, VectorAdditionConstants.CARTESIAN_COMPONENT_LENGTH ) :
                                      new Vector2( VectorAdditionConstants.CARTESIAN_COMPONENT_LENGTH, 0 );

      // Create a slot for each symbol
      const panelSlots = [];
      symbols.forEach( symbol => {
        panelSlots.push( new VectorCreatorPanelSlot( graph, graph.vectorSet, sceneNode, initialVectorComponents, {
          symbol: symbol
        } ) );
      } );

      super( panelSlots, options );
    }
  }

  return vectorAddition.register( 'Explore1DVectorCreatorPanel', Explore1DVectorCreatorPanel );
} );