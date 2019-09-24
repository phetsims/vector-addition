// Copyright 2019, University of Colorado Boulder

/**
 * Explore2DVectorCreatorPanel is a specialization of VectorCreatorPanel (the vector 'toolbox') for the 'Explore 2D' screen.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const Explore2DGraph = require( 'VECTOR_ADDITION/explore2D/model/Explore2DGraph' );
  const SceneNode = require( 'VECTOR_ADDITION/common/view/SceneNode' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorCreatorPanel = require( 'VECTOR_ADDITION/common/view/VectorCreatorPanel' );
  const VectorCreatorPanelSlot = require( 'VECTOR_ADDITION/common/view/VectorCreatorPanelSlot' );

  class Explore2DVectorCreatorPanel extends VectorCreatorPanel {

    /**
     * @param {Explore2DGraph} graph
     * @param {SceneNode} sceneNode
     * @param {string[]} symbols - the symbols corresponding to each slot
     * @param {Object} [options]
     */
    constructor( graph, sceneNode, symbols, options ) {

      assert && assert( graph instanceof Explore2DGraph, `invalid graph: ${graph}` );
      assert && assert( sceneNode instanceof SceneNode, `invalid sceneNode: ${sceneNode}` );
      assert && assert( _.every( symbols, symbol => typeof symbol === 'string' ), `invalid symbols: ${symbols}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `Extra prototype on options: ${options}` );

      options = _.extend( {

        // {Vector2} - initial components of newly created Vectors
        initialVectorComponents: new Vector2( VectorAdditionConstants.DEFAULT_VECTOR_LENGTH,
          VectorAdditionConstants.DEFAULT_VECTOR_LENGTH )

      }, options );

      //----------------------------------------------------------------------------------------
      // Loop through each symbol, creating a slot which corresponds with that symbol
      //----------------------------------------------------------------------------------------
      const panelSlots = [];

      symbols.forEach( symbol => {

        const panelSlot = new VectorCreatorPanelSlot( graph,
          graph.vectorSet,
          sceneNode,
          options.initialVectorComponents, {
            symbol: symbol
          } );

        panelSlots.push( panelSlot );
      } );

      super( panelSlots, options );
    }
  }

  return vectorAddition.register( 'Explore2DVectorCreatorPanel', Explore2DVectorCreatorPanel );
} );