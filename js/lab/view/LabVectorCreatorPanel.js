// Copyright 2019, University of Colorado Boulder

/**
 * LabVectorCreatorPanel is a specialization of VectorCreatorPanel (the vector 'toolbox') for the 'Lab' screen.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const LabGraph = require( 'VECTOR_ADDITION/lab/model/LabGraph' );
  const SceneNode = require( 'VECTOR_ADDITION/common/view/SceneNode' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorCreatorPanel = require( 'VECTOR_ADDITION/common/view/VectorCreatorPanel' );
  const VectorCreatorPanelSlot = require( 'VECTOR_ADDITION/common/view/VectorCreatorPanelSlot' );

  class LabVectorCreatorPanel extends VectorCreatorPanel {

    /**
     * @param {LabGraph} graph
     * @param {SceneNode} sceneNode
     * @param {Object} [options]
     */
    constructor( graph, sceneNode, options ) {

      assert && assert( graph instanceof LabGraph, `invalid graph: ${graph}` );
      assert && assert( sceneNode instanceof SceneNode, `invalid sceneNode: ${sceneNode}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `Extra prototype on options: ${options}` );

      options = _.extend( {
        slotSpacing: 40
      }, options );

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

      // Create a slot for each VectorSet
      const slots = [];
      graph.vectorSets.forEach( vectorSet => {
        slots.push( new VectorCreatorPanelSlot( graph, vectorSet, sceneNode, initialVectorComponents, {
          iconArrowSize: 50, // Determined empirically - should be slightly larger
          numberOfVectors: 10 // Each slot can create an 10 vectors
        } ) );
      } );

      super( slots, options );
    }
  }

  return vectorAddition.register( 'LabVectorCreatorPanel', LabVectorCreatorPanel );
} );