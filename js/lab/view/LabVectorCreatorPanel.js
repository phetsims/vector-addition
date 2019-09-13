// Copyright 2019, University of Colorado Boulder

/**
 * View for the panel with vectors to drag onto the 'Lab' screen.
 *
 * 'Extends' VectorCreatorPanel but has the following characteristics:
 *  - Creates a creator panel slot per VectorSet in a LabGraph.
 *  - Each Slot creates Vectors and adds them to a different VectorSet.
 *  - Slots are infinite
 *  - Vectors that are created do not have symbols
 *
 * For the 'Lab' screen, there are 2 of these panels (for polar/cartesian). They are not meant to be disposed.
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
     * @param {LabGraph} labGraph
     * @param {SceneNode} sceneNode
     * @param {Object} [options]
     */
    constructor( labGraph, sceneNode, options ) {

      assert && assert( labGraph instanceof LabGraph, `invalid labGraph: ${labGraph}` );
      assert && assert( sceneNode instanceof SceneNode, `invalid sceneNode: ${sceneNode}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype,
        `Extra prototype on Options: ${options}` );

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

      labGraph.vectorSets.forEach( vectorSet => {

        slots.push( new VectorCreatorPanelSlot( labGraph,
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