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
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorCreatorPanel = require( 'VECTOR_ADDITION/common/view/VectorCreatorPanel' );
  const VectorCreatorPanelSlot = require( 'VECTOR_ADDITION/common/view/VectorCreatorPanelSlot' );

  // constants

  // initial values for vectors in Cartesian scene, see https://github.com/phetsims/vector-addition/issues/227
  const CARTESTIAN_INITIAL_VECTOR_COMPONENTS = [
    new Vector2( 6, 8 ), // a
    new Vector2( 8, 6 ), // b
    new Vector2( 0, -10 ) // c
  ];

  // initial values for vectors in Polar scene, see https://github.com/phetsims/vector-addition/issues/227
  const POLAR_INITIAL_VECTOR_COMPONENTS = [
    Vector2.createPolar( 8, Util.toRadians( 30 ) ), // d
    Vector2.createPolar( 8, Util.toRadians( 60 ) ), // e
    Vector2.createPolar( 8, Util.toRadians( -90 ) ) // f
  ];

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

      // Get the initial vector components, they are different for each symbol.
      // See https://github.com/phetsims/vector-addition/issues/227
      const initialVectorComponents = ( graph.coordinateSnapMode === CoordinateSnapModes.CARTESIAN ) ?
                                    CARTESTIAN_INITIAL_VECTOR_COMPONENTS :
                                    POLAR_INITIAL_VECTOR_COMPONENTS;
      assert && assert( initialVectorComponents.length === symbols.length, 'components are required for each symbol' );

      // Create a slot for each symbol
      const panelSlots = [];
      for ( let i = 0; i < symbols.length; i++ ) {
        panelSlots.push( new VectorCreatorPanelSlot( graph, graph.vectorSet, sceneNode, initialVectorComponents[ i ], {
          symbol: symbols[ i ],
          iconVectorComponents: new Vector2( 5, 5 ) // all of the icons in the slots look the same, see #227
        } ) );
      }

      super( panelSlots, options );
    }
  }

  return vectorAddition.register( 'Explore2DVectorCreatorPanel', Explore2DVectorCreatorPanel );
} );