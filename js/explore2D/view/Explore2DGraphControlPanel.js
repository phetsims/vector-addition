// Copyright 2019, University of Colorado Boulder

/**
 * View for the Panel that appears on the upper-right corner of the 'Explore2D' screen.
 *
 * Explore 2D has 2 scenes: a polar and a cartesian scene. Each scene has a sum visible property and a sum checkbox.
 * The graph control panel must toggle between the 2 check boxes.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const Checkbox = require( 'SUN/Checkbox' );
  const ComponentStyleRadioButtonGroup = require( 'VECTOR_ADDITION/common/view/ComponentStyleRadioButtonGroup' );
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const Explore2DModel = require( 'VECTOR_ADDITION/explore2D/model/Explore2DModel' );
  // const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Panel = require( 'SUN/Panel' );
  const SumCheckbox = require( 'VECTOR_ADDITION/common/view/SumCheckbox' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  // const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorAdditionIconFactory = require( 'VECTOR_ADDITION/common/view/VectorAdditionIconFactory' );
  const VectorSet = require( 'VECTOR_ADDITION/common/model/VectorSet' );

  // strings
  const componentsString = require( 'string!VECTOR_ADDITION/components' );
  const valuesString = require( 'string!VECTOR_ADDITION/values' );

  // constants
  const CHECKBOX_OPTIONS = VectorAdditionConstants.CHECKBOX_OPTIONS;
  const PANEL_OPTIONS = VectorAdditionConstants.PANEL_OPTIONS;
  const PANEL_FONT = VectorAdditionConstants.PANEL_FONT;
  const CONTROL_PANEL_LAYOUT_BOX_OPTIONS = VectorAdditionConstants.CONTROL_PANEL_LAYOUT_BOX_OPTIONS;

  class Explore2DGraphControlPanel extends Panel {
    /**
     * @param {Explore2DModel} explore2DModel
     * @param {VectorSet} cartesianVectorSet
     * @param {VecotrSet} polarVectorSet
     * @param {Object} [options]
     * @constructor
     */
    constructor( explore2DModel, cartesianVectorSet, polarVectorSet, options ) {

      assert && assert( explore2DModel instanceof Explore2DModel, `invalid explore2DModel: ${explore2DModel}` );
      assert && assert( cartesianVectorSet instanceof VectorSet, `invalid cartesianVectorSet: ${cartesianVectorSet}` );
      assert && assert( polarVectorSet instanceof VectorSet, `invalid polarVectorSet: ${polarVectorSet}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype,
        `Extra prototype on Options: ${options}` );

      options = _.extend( {}, PANEL_OPTIONS, options );

      //----------------------------------------------------------------------------------------
      // Create the sum check boxes, one for each vector set in explore2D

      const cartesianSumCheckbox = new SumCheckbox( cartesianVectorSet.sumVisibleProperty,
        cartesianVectorSet.vectorGroup );

      const polarSumCheckbox = new SumCheckbox( polarVectorSet.sumVisibleProperty, polarVectorSet.vectorGroup );

      // Toggle visibility of the check boxes. This link is never disposed as the panel exists throughout the entire sim
      explore2DModel.coordinateSnapModeProperty.link( ( coordinateSnapMode ) => {

        polarSumCheckbox.visible = coordinateSnapMode === CoordinateSnapModes.POLAR;
        cartesianSumCheckbox.visible = coordinateSnapMode === CoordinateSnapModes.CARTESIAN;
      } );

      //----------------------------------------------------------------------------------------

      const graphControlPanelContent = new VBox( _.extend( {}, CONTROL_PANEL_LAYOUT_BOX_OPTIONS, {
        children: [
          new Node( { children: [ cartesianSumCheckbox, polarSumCheckbox ] } ),

          // values checkbox
          new Checkbox( new Text( valuesString, { font: PANEL_FONT } ),
            explore2DModel.valuesVisibleProperty,
            CHECKBOX_OPTIONS ),

          // angles checkbox
          new Checkbox( VectorAdditionIconFactory.createAngleIcon(),
            explore2DModel.angleVisibleProperty,
            CHECKBOX_OPTIONS ),

          // grid checkbox
          new Checkbox( VectorAdditionIconFactory.createGridIcon(),
            explore2DModel.gridVisibleProperty,
            CHECKBOX_OPTIONS ),

          // new Line( 0, 0, PANEL_OPTIONS.contentWidth, 0, { stroke: VectorAdditionColors.BLACK } ),
          new Text( componentsString, { font: PANEL_FONT } ),
          new ComponentStyleRadioButtonGroup( explore2DModel.componentStyleProperty )
        ]
      } ) );

      super( graphControlPanelContent, options );
    }
  }

  return vectorAddition.register( 'Explore2DGraphControlPanel', Explore2DGraphControlPanel );
} );