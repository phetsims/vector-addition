// Copyright 2019, University of Colorado Boulder

/**
 * View for the panel with vectors to drag onto the 'Explore 2D' screen.
 *
 * 'Extends' VectorCreatorPanel but has the following characteristics:
 *  - Creates a slot per symbol (which happens to be 3)
 *  - Each Slot creates Vectors and adds them to a the same VectorSet
 *  - Slots are non-infinite
 *
 * For the 'Explore 2D' screen, there are 2 of these panels (for polar/cartesian). They are not meant to be disposed.
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
     * @param {Explore2DGraph} explore2DGraph
     * @param {SceneNode} sceneNode
     * @param {string[]} symbols - the symbols corresponding to each slot
     * @param {Object} [options]
     */
    constructor( explore2DGraph, sceneNode, symbols, options ) {

      assert && assert( explore2DGraph instanceof Explore2DGraph, `invalid explore2DGraph: ${explore2DGraph}` );
      assert && assert( sceneNode instanceof SceneNode, `invalid sceneNode: ${sceneNode}` );
      assert && assert( _.every( symbols, symbol => typeof symbol === 'string' ), `invalid symbols: ${symbols}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype,
        `Extra prototype on Options: ${options}` );

      //----------------------------------------------------------------------------------------

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

        const panelSlot = new VectorCreatorPanelSlot( explore2DGraph,
          explore2DGraph.vectorSet,
          sceneNode,
          options.initialVectorComponents, {
            symbol: symbol
          } );

        panelSlots.push( panelSlot );

      } );

      super( panelSlots );
    }
  }

  return vectorAddition.register( 'Explore2DVectorCreatorPanel', Explore2DVectorCreatorPanel );
} );