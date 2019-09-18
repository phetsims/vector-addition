// Copyright 2019, University of Colorado Boulder

/**
 * Explore1DGraphControlPanel is the graph control panel for the 'Explore 2D' screen.
 * It exists for the lifetime of the sim and is not intended to be disposed.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AnglesCheckbox = require( 'VECTOR_ADDITION/common/view/AnglesCheckbox' );
  const Color = require( 'SCENERY/util/Color' );
  const ComponentStyleControl = require( 'VECTOR_ADDITION/common/view/ComponentStyleControl' );
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const GraphControlPanel = require( 'VECTOR_ADDITION/common/view/GraphControlPanel' );
  const HSeparator = require( 'SUN/HSeparator' );
  const Node = require( 'SCENERY/nodes/Node' );
  const SumCheckbox = require( 'VECTOR_ADDITION/common/view/SumCheckbox' );
  const ValuesCheckbox = require( 'VECTOR_ADDITION/common/view/ValuesCheckbox' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionGridCheckbox = require( 'VECTOR_ADDITION/common/view/VectorAdditionGridCheckbox' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionViewProperties = require( 'VECTOR_ADDITION/common/view/VectorAdditionViewProperties' );
  const VectorSet = require( 'VECTOR_ADDITION/common/model/VectorSet' );

  class Explore2DGraphControlPanel extends GraphControlPanel {

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

      const cartesianSumCheckbox = new SumCheckbox( cartesianVectorSet.sumVisibleProperty,
        cartesianVectorSet.vectorColorPalette );

      const polarSumCheckbox = new SumCheckbox( polarVectorSet.sumVisibleProperty,
        polarVectorSet.vectorColorPalette );

      // Toggle visibility of the SumCheckboxes to match coordinate snap mode.
      // Is never unlinked since the graph control panel is never disposed.
      viewProperties.coordinateSnapModeProperty.link( coordinateSnapMode => {
        polarSumCheckbox.visible = ( coordinateSnapMode === CoordinateSnapModes.POLAR );
        cartesianSumCheckbox.visible = ( coordinateSnapMode === CoordinateSnapModes.CARTESIAN );
      } );

      super( [

        // Sum
        new Node( {
          children: [ cartesianSumCheckbox, polarSumCheckbox ]
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

  return vectorAddition.register( 'Explore2DGraphControlPanel', Explore2DGraphControlPanel );
} );