// Copyright 2019, University of Colorado Boulder

/**
 * View for the panel with vectors to drag onto the 'Explore 1D' screen.
 *
 * 'Extends' VectorCreatorPanel but has the following characteristics:
 *  - Creates a slot per symbol (which happens to be 3)
 *  - Each Slot creates Vectors and adds them to a the same VectorSet
 *  - Slots are non-infinite
 *
 * For the 'Explore 1D' screen, there are 2 of these panels (for horizontal/vertical).
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

      //----------------------------------------------------------------------------------------

      options = _.extend( {

        // {Vector2} - initial components of newly created Vectors
        initialVectorComponents: graph.orientation === GraphOrientations.VERTICAL ?
                                 new Vector2( 0, VectorAdditionConstants.DEFAULT_VECTOR_LENGTH ) :
                                 new Vector2( VectorAdditionConstants.DEFAULT_VECTOR_LENGTH, 0 ),

        // super-class options
        slotSpacing: ( graph.orientation === GraphOrientations.VERTICAL ) ? 22 : 28

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

  return vectorAddition.register( 'Explore1DVectorCreatorPanel', Explore1DVectorCreatorPanel );
} );