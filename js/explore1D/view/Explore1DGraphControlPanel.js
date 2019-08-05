// Copyright 2019, University of Colorado Boulder

/**
 * View for the Panel that appears on the upper-right corner of the 'Explore 1D' screen.
 *
 * Extends GraphControlPanel but adds the following functionality:
 *  - Creates 1 sum checkboxes that is always visible (shared between both Graphs)
 *  - Doesn't have an angle checkbox or component style radio button group
 *  - Has both an angle checkbox and a component style radio button group
 *
 * Graph Control Panels are not meant to be disposed, and links are left as-is.
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
      // Create the Sum Checkbox container. On 'Explore 1D', the sum visible property is shared for both graph, so only
      // one checkbox is created and it is always visible.
      const sumCheckboxContainer = new Node().addChild( new SumCheckbox( sumVisibleProperty, vectorColorGroup ) );

      //----------------------------------------------------------------------------------------

      super( valuesVisibleProperty, gridVisibleProperty, {
        sumCheckboxContainer: sumCheckboxContainer
      } );
    }
  }

  return vectorAddition.register( 'Explore1DGraphControlPanel', Explore1DGraphControlPanel );
} );