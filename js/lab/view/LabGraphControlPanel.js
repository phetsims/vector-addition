// Copyright 2019, University of Colorado Boulder

/**
 *  LabGraphControlPanel is the graph control panel for the 'Lab' screen.
 *  It exists for the lifetime of the sim and is not intended to be disposed.
 *
 *  @author Brandon Li
 *  @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AnglesCheckbox = require( 'VECTOR_ADDITION/common/view/AnglesCheckbox' );
  const Color = require( 'SCENERY/util/Color' );
  const ComponentStyleControl = require( 'VECTOR_ADDITION/common/view/ComponentStyleControl' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const GraphControlPanel = require( 'VECTOR_ADDITION/common/view/GraphControlPanel' );
  const HSeparator = require( 'SUN/HSeparator' );
  const LabGraph = require( 'VECTOR_ADDITION/lab/model/LabGraph' );
  const Node = require( 'SCENERY/nodes/Node' );
  const SumCheckbox = require( 'VECTOR_ADDITION/common/view/SumCheckbox' );
  const ValuesCheckbox = require( 'VECTOR_ADDITION/common/view/ValuesCheckbox' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionGridCheckbox = require( 'VECTOR_ADDITION/common/view/VectorAdditionGridCheckbox' );
  const VectorAdditionViewProperties = require( 'VECTOR_ADDITION/common/view/VectorAdditionViewProperties' );

  class LabGraphControlPanel extends GraphControlPanel {

    /**
     * @param {LabGraph} cartesianGraph
     * @param {LabGraph} polarGraph
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {Property.<boolean>} sumVisibleProperty1
     * @param {Property.<boolean>} sumVisibleProperty2
     * @param {VectorAdditionViewProperties} viewProperties
     * @param {Object} [options]
     */
    constructor( cartesianGraph, polarGraph, componentStyleProperty,
                 sumVisibleProperty1, sumVisibleProperty2, viewProperties, options ) {

      assert && assert( cartesianGraph instanceof LabGraph, `invalid cartesianGraph: ${cartesianGraph}` );
      assert && assert( polarGraph instanceof LabGraph, `invalid polarGraph: ${polarGraph}` );
      assert && assert( componentStyleProperty instanceof EnumerationProperty, `invalid componentStyleProperty: ${componentStyleProperty}` );
      assert && assert( viewProperties instanceof VectorAdditionViewProperties, `invalid viewProperties: ${viewProperties}` );

      // Create 2 'Sum' checkboxes for each graph
      const sumCheckboxContainer = new Node();
      [ cartesianGraph, polarGraph ].forEach( graph => {

        const sumCheckboxes = new VBox( {
          children: [
            new SumCheckbox( sumVisibleProperty1, graph.vectorSet1.vectorColorPalette ),
            new SumCheckbox( sumVisibleProperty2, graph.vectorSet2.vectorColorPalette )
          ],
          spacing: VectorAdditionConstants.GRAPH_CONTROL_PANEL_Y_SPACING
        } );
        sumCheckboxContainer.addChild( sumCheckboxes );

        // Toggle visibility of the sumCheckboxes. Should only be visible if the coordinateSnapMode matches the
        // graph's coordinateSnapMode. Is never unlinked since the graph control panel is never disposed.
        viewProperties.coordinateSnapModeProperty.link( coordinateSnapMode => {
          sumCheckboxes.visible = coordinateSnapMode === graph.coordinateSnapMode;
        } );
      } );

      super( [

        // Sums
        sumCheckboxContainer,

        // Values
        new ValuesCheckbox( viewProperties.valuesVisibleProperty ),

        // Angles
        new AnglesCheckbox( viewProperties.anglesVisibleProperty ),

        // Grid
        new VectorAdditionGridCheckbox( viewProperties.gridVisibleProperty ),

        // separator
        new HSeparator( VectorAdditionConstants.GRAPH_CONTROL_PANEL_CONTENT_WIDTH, {
          stroke: Color.BLACK
        } ),

        // Component Style
        new ComponentStyleControl( componentStyleProperty, {
          maxWidth: VectorAdditionConstants.GRAPH_CONTROL_PANEL_CONTENT_WIDTH
        } )

      ], options );
    }
  }

  return vectorAddition.register( 'LabGraphControlPanel', LabGraphControlPanel );
} );