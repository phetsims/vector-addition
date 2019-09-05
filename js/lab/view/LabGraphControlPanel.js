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
  const BooleanProperty = require( 'AXON/BooleanProperty' );
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
  const VectorAdditionGridCheckbox = require( 'VECTOR_ADDITION/common/view/VectorAdditionGridCheckbox' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );

  class LabGraphControlPanel extends GraphControlPanel {

    /**
     * @param {LabGraph} cartesianGraph
     * @param {LabGraph} polarGraph
     * @param {EnumerationProperty.<CoordinateSnapModes>} coordinateSnapModeProperty
     * @param {Property.<boolean>} sumVisibleProperty1
     * @param {Property.<boolean>} sumVisibleProperty2
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {BooleanProperty} anglesVisibleProperty
     * @param {BooleanProperty} gridVisibleProperty
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {Object} [options]
     */
    constructor( cartesianGraph, polarGraph, coordinateSnapModeProperty,
                 sumVisibleProperty1, sumVisibleProperty2,
                 valuesVisibleProperty, anglesVisibleProperty, gridVisibleProperty,
                 componentStyleProperty, options ) {

      assert && assert( cartesianGraph instanceof LabGraph, `invalid cartesianGraph: ${cartesianGraph}` );
      assert && assert( polarGraph instanceof LabGraph, `invalid polarGraph: ${polarGraph}` );
      assert && assert( coordinateSnapModeProperty instanceof EnumerationProperty, `invalid coordinateSnapModeProperty: ${coordinateSnapModeProperty}` );
      assert && assert( valuesVisibleProperty instanceof BooleanProperty, `invalid valuesVisibleProperty: ${valuesVisibleProperty}` );
      assert && assert( anglesVisibleProperty instanceof BooleanProperty, `invalid anglesVisibleProperty: ${anglesVisibleProperty}` );
      assert && assert( gridVisibleProperty instanceof BooleanProperty, `invalid gridVisibleProperty: ${gridVisibleProperty}` );
      assert && assert( componentStyleProperty instanceof EnumerationProperty, `invalid componentStyleProperty: ${componentStyleProperty}` );

      const sumCheckboxContainer = new Node();
      [ cartesianGraph, polarGraph ].forEach( labGraph => {

        // Create the 2 sum checkboxes for each vector set inside of a VBox
        const sumCheckboxes = new VBox( {
          children: [
            new SumCheckbox( sumVisibleProperty1, labGraph.vectorSet1.vectorColorPalette ),
            new SumCheckbox( sumVisibleProperty2, labGraph.vectorSet2.vectorColorPalette )
          ],
          spacing: VectorAdditionConstants.GRAPH_CONTROL_PANEL_Y_SPACING
        } );

        // Toggle visibility of the sumCheckboxes. Should only be visible if the coordinateSnapMode matches the
        // labGraph's coordinateSnapMode. Is never unlinked since the graph control panel is never disposed.
        coordinateSnapModeProperty.link( coordinateSnapMode => {
          sumCheckboxes.visible = coordinateSnapMode === labGraph.coordinateSnapMode;
        } );

        // Add the sum checkbox VBox to the sum checkbox container
        sumCheckboxContainer.addChild( sumCheckboxes );
      } );

      super( [

        // Sums
        sumCheckboxContainer,

        // Values
        new ValuesCheckbox( valuesVisibleProperty ),

        // Angles
        new AnglesCheckbox( anglesVisibleProperty ),

        // Grid
        new VectorAdditionGridCheckbox( gridVisibleProperty ),

        // separator
        new HSeparator( VectorAdditionConstants.GRAPH_CONTROL_PANEL_CONTENT_WIDTH, {
          stroke: VectorAdditionColors.BLACK
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