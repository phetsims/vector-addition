// Copyright 2019, University of Colorado Boulder

/**
 * Explore2DVectorCreatorPanel is a specialization of VectorCreatorPanel (the vector 'toolbox') for the 'Explore 2D' screen.
 *
 * @author Brandon Li
 */
define( require => {
  'use strict';

  // modules
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
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

      // Create the initial vector components
      let initialVectorComponents = null;
      if ( graph.coordinateSnapMode === CoordinateSnapModes.CARTESIAN ) {
        initialVectorComponents =
          new Vector2( VectorAdditionConstants.CARTESIAN_COMPONENT_LENGTH, VectorAdditionConstants.CARTESIAN_COMPONENT_LENGTH );
      }
      else {
        initialVectorComponents =
          Vector2.createPolar( VectorAdditionConstants.POLAR_VECTOR_MAGNITUDE, VectorAdditionConstants.POLAR_VECTOR_ANGLE );
      }

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

  return vectorAddition.register( 'Explore2DVectorCreatorPanel', Explore2DVectorCreatorPanel );
} );