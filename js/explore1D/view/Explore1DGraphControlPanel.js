// Copyright 2019, University of Colorado Boulder

/**
 * View for the Panel that appears on the upper-right corner of the 'Explore 1D' screen.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const GraphControlPanel = require( 'VECTOR_ADDITION/common/view/GraphControlPanel' );
  const Node = require( 'SCENERY/nodes/Node' );
  const SumCheckbox = require( 'VECTOR_ADDITION/common/view/SumCheckbox' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorColorGroups = require( 'VECTOR_ADDITION/common/model/VectorColorGroups' );


  class Explore1DGraphControlPanel extends GraphControlPanel {

    /**
     * @param {BooleanProperty} sumVisibleProperty - shared sum visible property for both scenes in 'Explore 1D'
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {BooleanProperty} gridVisibleProperty
     * @param {VectorColorGroups} vectorColorGroup - shared color group for both scenes in 'Explore 1D'
     */
    constructor( sumVisibleProperty, valuesVisibleProperty, gridVisibleProperty, vectorColorGroup ) {

      assert && assert( sumVisibleProperty instanceof BooleanProperty,
        `invalid sumVisibleProperty: ${sumVisibleProperty}` );
      assert && assert( valuesVisibleProperty instanceof BooleanProperty,
        `invalid valuesVisibleProperty: ${valuesVisibleProperty}` );
      assert && assert( gridVisibleProperty instanceof BooleanProperty,
        `invalid gridVisibleProperty: ${gridVisibleProperty}` );
      assert && assert( VectorColorGroups.includes( vectorColorGroup ), `invalid vectorColorGroup: ${vectorColorGroup}` );

      //----------------------------------------------------------------------------------------
      // On 'Explore 1D' there is only one sum checkbox, and it is shared for all scenes.
      const sumCheckboxContainer = new Node().addChild( new SumCheckbox( sumVisibleProperty, vectorColorGroup ) );

      super( valuesVisibleProperty, gridVisibleProperty, {
        sumCheckboxContainer: sumCheckboxContainer
      } );
    }
  }

  return vectorAddition.register( 'Explore1DGraphControlPanel', Explore1DGraphControlPanel );
} );