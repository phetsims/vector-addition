// Copyright 2019, University of Colorado Boulder

/**
 * View for the Panel that appears on the upper-right corner of the 'Explore 2D' screen.
 *
 * Extends GraphControlPanel but adds the following functionality:
 *  - Creates 1 sum checkboxes per graph (for a total of 2 sum checkboxes since there are 2 graphs)
 *  - Toggles visibility of the sum checkboxes based on the coordinateSnapModeProperty
 *  - Has both an angle checkbox and a component style radio button group
 *
 * Graph Control Panels are not meant to be disposed, and links are left as-is.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const GraphControlPanel = require( 'VECTOR_ADDITION/common/view/GraphControlPanel' );
  const Node = require( 'SCENERY/nodes/Node' );
  const SumCheckbox = require( 'VECTOR_ADDITION/common/view/SumCheckbox' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionViewProperties = require( 'VECTOR_ADDITION/common/view/VectorAdditionViewProperties' );
  const VectorSet = require( 'VECTOR_ADDITION/common/model/VectorSet' );


  class Explore2DGraphControlPanel extends GraphControlPanel {

    /**
     * @param {VectorAdditionViewProperties} viewProperties
     * @param {VectorSet} cartesianVectorSet
     * @param {VectorSet} polarVectorSet
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {Object} [options]
     */
    constructor( viewProperties, cartesianVectorSet, polarVectorSet, componentStyleProperty, options ) {

      assert && assert( viewProperties instanceof VectorAdditionViewProperties, `invalid viewProperties: ${viewProperties}` );
      assert && assert( cartesianVectorSet instanceof VectorSet, `invalid cartesianVectorSet: ${cartesianVectorSet}` );
      assert && assert( polarVectorSet instanceof VectorSet, `invalid polarVectorSet: ${polarVectorSet}` );
      assert && assert( componentStyleProperty instanceof EnumerationProperty
      && ComponentStyles.includes( componentStyleProperty.value ),
        `invalid componentStyleProperty: ${componentStyleProperty}` );

      //----------------------------------------------------------------------------------------
      // Create the sum checkboxes (polar/cartesian)

      const cartesianSumCheckbox = new SumCheckbox( cartesianVectorSet.sumVisibleProperty,
        cartesianVectorSet.vectorColorGroup );

      const polarSumCheckbox = new SumCheckbox( polarVectorSet.sumVisibleProperty,
        polarVectorSet.vectorColorGroup );

      // Toggle visibility of the sumCheckboxes. Should only be visible if the coordinateSnapMode matches the
      // coordinate snap mode. Is never unlinked since the graph control panel is never disposed.
      viewProperties.coordinateSnapModeProperty.link( ( coordinateSnapMode ) => {

        polarSumCheckbox.visible = coordinateSnapMode === CoordinateSnapModes.POLAR;
        cartesianSumCheckbox.visible = coordinateSnapMode === CoordinateSnapModes.CARTESIAN;

      } );

      //----------------------------------------------------------------------------------------

      super( viewProperties.valuesVisibleProperty, viewProperties.gridVisibleProperty, _.extend( {
        sumCheckboxContainer: new Node( { children: [ cartesianSumCheckbox, polarSumCheckbox ] } ),
        angleVisibleProperty: viewProperties.angleVisibleProperty,
        componentStyleProperty: componentStyleProperty
      }, options ) );
    }
  }

  return vectorAddition.register( 'Explore2DGraphControlPanel', Explore2DGraphControlPanel );
} );