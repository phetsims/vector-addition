// Copyright 2019, University of Colorado Boulder

/**
 * View for the Panel that appears on the upper-right corner of the 'Explore 2D' screen.
 *
 * Explore 2D has 2 scenes: a polar and a cartesian scene. Each scene has a separate Sum visible Property/Checkbox
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
     * @param {VecotrSet} polarVectorSet
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     */
    constructor( viewProperties, cartesianVectorSet, polarVectorSet, componentStyleProperty ) {

      assert && assert( viewProperties instanceof VectorAdditionViewProperties, `invalid viewProperties: ${viewProperties}` );
      assert && assert( cartesianVectorSet instanceof VectorSet, `invalid cartesianVectorSet: ${cartesianVectorSet}` );
      assert && assert( polarVectorSet instanceof VectorSet, `invalid polarVectorSet: ${polarVectorSet}` );
      assert && assert( componentStyleProperty instanceof EnumerationProperty
      && ComponentStyles.includes( componentStyleProperty.value ),
        `invalid componentStyleProperty: ${componentStyleProperty}` );

      //----------------------------------------------------------------------------------------
      // Create the sum check boxes, one for each vector set

      const cartesianSumCheckbox = new SumCheckbox( cartesianVectorSet.sumVisibleProperty,
        cartesianVectorSet.vectorColorGroup );

      const polarSumCheckbox = new SumCheckbox( polarVectorSet.sumVisibleProperty,
        polarVectorSet.vectorColorGroup );

      const sumCheckboxContainer = new Node( { children: [ cartesianSumCheckbox, polarSumCheckbox ] } );

      // Toggle visibility of the check boxes. This link is never disposed as the panel exists throughout the entire sim
      viewProperties.coordinateSnapModeProperty.link( ( coordinateSnapMode ) => {

        polarSumCheckbox.visible = coordinateSnapMode === CoordinateSnapModes.POLAR;
        cartesianSumCheckbox.visible = coordinateSnapMode === CoordinateSnapModes.CARTESIAN;

      } );

      //----------------------------------------------------------------------------------------

      super( viewProperties.valuesVisibleProperty, viewProperties.gridVisibleProperty, {

        sumCheckboxContainer: sumCheckboxContainer,
        angleVisibleProperty: viewProperties.angleVisibleProperty,
        componentStyleProperty: componentStyleProperty

      } );

    }
  }

  return vectorAddition.register( 'Explore2DGraphControlPanel', Explore2DGraphControlPanel );
} );