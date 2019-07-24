// Copyright 2019, University of Colorado Boulder

/**
 * View for the Panel that appears on the upper-right corner of the 'Lab' screen.
 *
 * Lab has 2 scenes: a polar and a cartesian scene. Each scene has two sum visible Properties and two sum check boxes.
 * The graph control panel must toggle between the 2 scenes' check boxes.
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
  const VBox = require( 'SCENERY/nodes/VBox' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionViewProperties = require( 'VECTOR_ADDITION/common/view/VectorAdditionViewProperties' );
  const VectorSet = require( 'VECTOR_ADDITION/common/model/VectorSet' );

  // constants
  const GRAPH_CONTROL_PANEL_SPACING = VectorAdditionConstants.GRAPH_CONTROL_PANEL_SPACING;

  class LabGraphControlPanel extends GraphControlPanel {
    /**
     * @param {VectorAdditionViewProperties} viewProperties
     * @param {VectorSet} cartesianVectorSet1 - the first cartesian vector set. Each scene in 'lab' has 2 vector sets
     * @param {VectorSet} cartesianVectorSet2
     * @param {VectorSet} polarVectorSet1
     * @param {VectorSet} polarVectorSet2
     */
    constructor( viewProperties,
                 cartesianVectorSet1,
                 cartesianVectorSet2,
                 polarVectorSet1,
                 polarVectorSet2,
                 componentStyleProperty ) {


      assert && assert( viewProperties instanceof VectorAdditionViewProperties,
        `invalid explore2DModel: ${viewProperties}` );
      assert && assert( cartesianVectorSet1 instanceof VectorSet,
        `invalid cartesianVectorSet1: ${cartesianVectorSet1}` );
      assert && assert( cartesianVectorSet2 instanceof VectorSet,
        `invalid cartesianVectorSet2: ${cartesianVectorSet2}` );
      assert && assert( polarVectorSet1 instanceof VectorSet, `invalid polarVectorSet1: ${polarVectorSet1}` );
      assert && assert( polarVectorSet2 instanceof VectorSet, `invalid polarVectorSet2: ${polarVectorSet2}` );
      assert && assert( componentStyleProperty instanceof EnumerationProperty
      && ComponentStyles.includes( componentStyleProperty.value ),
        `invalid componentStyleProperty: ${componentStyleProperty}` );


      //----------------------------------------------------------------------------------------
      // Create the sum check boxes, two for each vector set

      const cartesianSet1SumCheckbox = new SumCheckbox( cartesianVectorSet1.sumVisibleProperty,
        cartesianVectorSet1.vectorColorGroup );

      const cartesianSet2SumCheckbox = new SumCheckbox( cartesianVectorSet2.sumVisibleProperty,
        cartesianVectorSet2.vectorColorGroup );

      const polarSet1SumCheckbox = new SumCheckbox( polarVectorSet1.sumVisibleProperty,
        polarVectorSet1.vectorColorGroup );

      const polarSet2SumCheckbox = new SumCheckbox( polarVectorSet2.sumVisibleProperty,
        polarVectorSet2.vectorColorGroup );

      //----------------------------------------------------------------------------------------
      // Create V Boxes for the 2 check boxes
      const polarCheckboxes = new VBox( {
        children: [
          polarSet1SumCheckbox,
          polarSet2SumCheckbox
        ],
        spacing: GRAPH_CONTROL_PANEL_SPACING
      } );
      const cartesianCheckboxes = new VBox( {
        children: [
          cartesianSet1SumCheckbox,
          cartesianSet2SumCheckbox
        ],
        spacing: GRAPH_CONTROL_PANEL_SPACING
      } );

      //----------------------------------------------------------------------------------------
      // Toggle visibility of the check boxes, never disposed as the panel exists throughout the entire sim
      viewProperties.coordinateSnapModeProperty.link( ( coordinateSnapMode ) => {

        polarCheckboxes.visible = coordinateSnapMode === CoordinateSnapModes.POLAR;
        cartesianCheckboxes.visible = coordinateSnapMode === CoordinateSnapModes.CARTESIAN;
      } );

      const sumCheckboxContainer = new Node().setChildren( [ cartesianCheckboxes, polarCheckboxes ] );
 
      //----------------------------------------------------------------------------------------

      super( viewProperties.valuesVisibleProperty, viewProperties.gridVisibleProperty, {

        sumCheckboxContainer: sumCheckboxContainer,
        angleVisibleProperty: viewProperties.angleVisibleProperty,
        componentStyleProperty: componentStyleProperty

      } );
    }
  }

  return vectorAddition.register( 'LabGraphControlPanel', LabGraphControlPanel );
} );