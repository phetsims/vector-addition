// Copyright 2019, University of Colorado Boulder

/**
 * View for the Panel that appears on the upper-right corner of the 'Lab' screen.
 *
 * Extends GraphControlPanel but adds the following functionality:
 *  - Creates 2 sum checkboxes per graph (for a total of 4 sum checkboxes since there are 2 graphs)
 *  - Toggles visibility of the sum checkboxes (to only shows 2 at a time) based on the coordinateSnapModeProperty
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
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const GraphControlPanel = require( 'VECTOR_ADDITION/common/view/GraphControlPanel' );
  const LabGraph = require( 'VECTOR_ADDITION/lab/model/LabGraph' );
  const Node = require( 'SCENERY/nodes/Node' );
  const SumCheckbox = require( 'VECTOR_ADDITION/common/view/SumCheckbox' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionViewProperties = require( 'VECTOR_ADDITION/common/view/VectorAdditionViewProperties' );

  // constants
  const GRAPH_CONTROL_PANEL_SPACING = VectorAdditionConstants.GRAPH_CONTROL_PANEL_SPACING;


  class LabGraphControlPanel extends GraphControlPanel {

    /**
     * @param {LabGraph} cartesianGraph
     * @param {LabGraph} polarGraph
     * @param {VectorAdditionViewProperties} viewProperties
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     */
    constructor( cartesianGraph, polarGraph, viewProperties, componentStyleProperty ) {

      assert && assert( _.every( [ cartesianGraph, polarGraph ], graph => graph instanceof LabGraph ) );
      assert && assert( viewProperties instanceof VectorAdditionViewProperties,
        `invalid explore2DModel: ${viewProperties}` );
      assert && assert( componentStyleProperty instanceof EnumerationProperty
      && ComponentStyles.includes( componentStyleProperty.value ),
        `invalid componentStyleProperty: ${componentStyleProperty}` );

      //----------------------------------------------------------------------------------------

      // Create the container for all the sum checkboxes
      const sumCheckboxContainer = new Node();

      //----------------------------------------------------------------------------------------
      // Create the 2 sum checkboxes for each graph
      [ cartesianGraph, polarGraph ].forEach( labGraph => {

        // Create the 2 sum checkboxes for each graph inside of a VBox
        const sumCheckboxes = new VBox( {
          children: [
            new SumCheckbox( labGraph.sumVisibleProperty1, labGraph.vectorSet1.vectorColorGroup ),
            new SumCheckbox( labGraph.sumVisibleProperty2, labGraph.vectorSet2.vectorColorGroup )
          ],
          spacing: GRAPH_CONTROL_PANEL_SPACING
        } );

        // Toggle visibility of the sumCheckboxes. Should only be visible if the coordinateSnapMode matches the
        // labGraph's coordinateSnapMode. Is never unlinked since the graph control panel is never disposed.
        viewProperties.coordinateSnapModeProperty.link( coordinateSnapMode => {
          sumCheckboxes.visible = coordinateSnapMode === labGraph.coordinateSnapMode;
        } );

        // Add the sum checkbox VBox to the sum checkbox container
        sumCheckboxContainer.addChild( sumCheckboxes );

      } );

      //----------------------------------------------------------------------------------------
      // Create the GraphControlPanel

      super( viewProperties.valuesVisibleProperty, viewProperties.gridVisibleProperty, {
        sumCheckboxContainer: sumCheckboxContainer,
        angleVisibleProperty: viewProperties.angleVisibleProperty,
        componentStyleProperty: componentStyleProperty
      } );

    }
  }

  return vectorAddition.register( 'LabGraphControlPanel', LabGraphControlPanel );
} );