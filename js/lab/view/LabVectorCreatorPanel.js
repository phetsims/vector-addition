// Copyright 2019, University of Colorado Boulder

/**
 * LabVectorCreatorPanel is a specialization of VectorCreatorPanel (the vector 'toolbox') for the 'Lab' screen.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const LabGraph = require( 'VECTOR_ADDITION/lab/model/LabGraph' );
  const merge = require( 'PHET_CORE/merge' );
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

      options = merge( {

        // {Vector2} - initial components of newly created Vectors
        initialVectorComponents: new Vector2( VectorAdditionConstants.DEFAULT_VECTOR_LENGTH,
          VectorAdditionConstants.DEFAULT_VECTOR_LENGTH ),

        // {Object} passed to both of the VectorCreatorPanelSlot instances
        vectorCreatorPanelSlotOptions: {
          iconArrowSize: 50,  // Determined empirically - should be slightly larger
          isInfinite: true    // Slots are infinite
        },

        // vertical space between slots in the panel
        slotSpacing: 40

      }, options );

      //----------------------------------------------------------------------------------------
      // Create a 'slot' for each Vector Set in the LabGraph (which happens to be 2)

      const slots = [];

      graph.vectorSets.forEach( vectorSet => {

        slots.push( new VectorCreatorPanelSlot( graph,
          vectorSet,
          sceneNode,
          options.initialVectorComponents,
          options.vectorCreatorPanelSlotOptions ) );
      } );

      super( slots, options );
    }
  }

  return vectorAddition.register( 'LabVectorCreatorPanel', LabVectorCreatorPanel );
} );