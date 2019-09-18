// Copyright 2019, University of Colorado Boulder

/**
 * EquationGraphControlPanel is the graph control panel for the 'Equation' screen.
 *  It exists for the lifetime of the sim and is not intended to be disposed.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AnglesCheckbox = require( 'VECTOR_ADDITION/common/view/AnglesCheckbox' );
  const Color = require( 'SCENERY/util/Color' );
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const ComponentStyleControl = require( 'VECTOR_ADDITION/common/view/ComponentStyleControl' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const GraphControlPanel = require( 'VECTOR_ADDITION/common/view/GraphControlPanel' );
  const HSeparator = require( 'SUN/HSeparator' );
  const Node = require( 'SCENERY/nodes/Node' );
  const ValuesCheckbox = require( 'VECTOR_ADDITION/common/view/ValuesCheckbox' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorCheckbox = require( 'VECTOR_ADDITION/common/view/VectorCheckbox' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionGridCheckbox = require( 'VECTOR_ADDITION/common/view/VectorAdditionGridCheckbox' );
  const VectorAdditionViewProperties = require( 'VECTOR_ADDITION/common/view/VectorAdditionViewProperties' );
  const VectorSet = require( 'VECTOR_ADDITION/common/model/VectorSet' );

  class EquationGraphControlPanel extends GraphControlPanel {

    /**
     * @param {VectorSet} cartesianVectorSet
     * @param {VectorSet} polarVectorSet
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {VectorAdditionViewProperties} viewProperties
     * @param {Object} [options]
     */
    constructor( cartesianVectorSet, polarVectorSet, componentStyleProperty, viewProperties, options ) {

      assert && assert( cartesianVectorSet instanceof VectorSet, `invalid cartesianVectorSet: ${cartesianVectorSet}` );
      assert && assert( polarVectorSet instanceof VectorSet, `invalid polarVectorSet: ${polarVectorSet}` );
      assert && assert( componentStyleProperty instanceof EnumerationProperty, `invalid componentStyleProperty: ${componentStyleProperty}` );
      assert && assert( viewProperties instanceof VectorAdditionViewProperties, `invalid viewProperties: ${viewProperties}` );

      const cartesianVectorCheckbox = new VectorCheckbox( cartesianVectorSet.sumVisibleProperty,
        cartesianVectorSet.sumVector.symbol, {
          vectorFill: cartesianVectorSet.vectorColorPalette.sumFill,
          vectorStroke: cartesianVectorSet.vectorColorPalette.sumStroke
        } );

      const polarVectorCheckbox = new VectorCheckbox( polarVectorSet.sumVisibleProperty,
        polarVectorSet.sumVector.symbol, {
          vectorFill: polarVectorSet.vectorColorPalette.sumFill,
          vectorStroke: polarVectorSet.vectorColorPalette.sumStroke
        } );

      // Toggle visibility of the SumCheckboxes to match coordinate snap mode.
      // Is never unlinked since the graph control panel is never disposed.
      viewProperties.coordinateSnapModeProperty.link( coordinateSnapMode => {
        cartesianVectorCheckbox.visible = ( coordinateSnapMode === CoordinateSnapModes.CARTESIAN );
        polarVectorCheckbox.visible = ( coordinateSnapMode === CoordinateSnapModes.POLAR );
      } );

      super( [

        // Sum ('c' or 'f')
        new Node( {
          children: [ cartesianVectorCheckbox, polarVectorCheckbox ]
        } ),

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

  return vectorAddition.register( 'EquationGraphControlPanel', EquationGraphControlPanel );
} );