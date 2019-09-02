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
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const ComponentStyleControl = require( 'VECTOR_ADDITION/common/view/ComponentStyleControl' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const GraphControlPanel = require( 'VECTOR_ADDITION/common/view/GraphControlPanel' );
  const HSeparator = require( 'SUN/HSeparator' );
  const Node = require( 'SCENERY/nodes/Node' );
  const ValuesCheckbox = require( 'VECTOR_ADDITION/common/view/ValuesCheckbox' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorCheckbox = require( 'VECTOR_ADDITION/common/view/VectorCheckbox' );
  const VectorAdditionGridCheckbox = require( 'VECTOR_ADDITION/common/view/VectorAdditionGridCheckbox' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorSet = require( 'VECTOR_ADDITION/common/model/VectorSet' );

  // constants
  const VECTOR_CHECKBOX_OPTIONS = {
    vectorFill: VectorAdditionColors.EQUATION_SUM_FILL,
    vectorStroke: VectorAdditionColors.EQUATION_SUM_STROKE
  };

  class EquationGraphControlPanel extends GraphControlPanel {

    /**
     * @param {VectorSet} cartesianVectorSet
     * @param {VectorSet} polarVectorSet
     * @param {EnumerationProperty.<CoordinateSnapModes>} coordinateSnapModeProperty
     * @param {BooleanProperty} valuesVisibleProperty
     * @param {BooleanProperty} anglesVisibleProperty
     * @param {BooleanProperty} gridVisibleProperty
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {Object} [options]
     */
    constructor( cartesianVectorSet, polarVectorSet, coordinateSnapModeProperty,
                 valuesVisibleProperty, anglesVisibleProperty, gridVisibleProperty, componentStyleProperty, options ) {

      assert && assert( cartesianVectorSet instanceof VectorSet, `invalid cartesianVectorSet: ${cartesianVectorSet}` );
      assert && assert( polarVectorSet instanceof VectorSet, `invalid polarVectorSet: ${polarVectorSet}` );
      assert && assert( coordinateSnapModeProperty instanceof EnumerationProperty, `invalid coordinateSnapModeProperty: ${coordinateSnapModeProperty}` );
      assert && assert( valuesVisibleProperty instanceof BooleanProperty, `invalid valuesVisibleProperty: ${valuesVisibleProperty}` );
      assert && assert( anglesVisibleProperty instanceof BooleanProperty, `invalid anglesVisibleProperty: ${anglesVisibleProperty}` );
      assert && assert( gridVisibleProperty instanceof BooleanProperty, `invalid gridVisibleProperty: ${gridVisibleProperty}` );
      assert && assert( componentStyleProperty instanceof EnumerationProperty, `invalid componentStyleProperty: ${componentStyleProperty}` );

      const cartesianVectorCheckbox = new VectorCheckbox( cartesianVectorSet.sumVisibleProperty,
        cartesianVectorSet.vectorSum.symbol, VECTOR_CHECKBOX_OPTIONS );

      const polarVectorCheckbox = new VectorCheckbox( polarVectorSet.sumVisibleProperty,
        polarVectorSet.vectorSum.symbol, VECTOR_CHECKBOX_OPTIONS );

      // Toggle visibility of the sumCheckboxes. Should only be visible if the coordinateSnapMode matches the
      // coordinate snap mode. Is never unlinked since the graph control panel is never disposed.
      coordinateSnapModeProperty.link( ( coordinateSnapMode ) => {
        cartesianVectorCheckbox.visible = ( coordinateSnapMode === CoordinateSnapModes.CARTESIAN );
        polarVectorCheckbox.visible = ( coordinateSnapMode === CoordinateSnapModes.POLAR );
      } );

      super( [

        // Sum ('c' or 'f')
        new Node( {
          children: [ cartesianVectorCheckbox, polarVectorCheckbox ]
        } ),

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

  return vectorAddition.register( 'EquationGraphControlPanel', EquationGraphControlPanel );
} );