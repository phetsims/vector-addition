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
  const Checkbox = require( 'SUN/Checkbox' );
  const ComponentStyleRadioButtonGroup = require( 'VECTOR_ADDITION/common/view/ComponentStyleRadioButtonGroup' );
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const LabModel = require( 'VECTOR_ADDITION/lab/model/LabModel' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Panel = require( 'SUN/Panel' );
  const SumCheckbox = require( 'VECTOR_ADDITION/common/view/SumCheckbox' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
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
  const PANEL_WIDTH = VectorAdditionConstants.PANEL_OPTIONS.minWidth - 2 * VectorAdditionConstants.PANEL_OPTIONS.xMargin;

  class LabGraphControlPanel extends Panel {
    /**
     * @param {LabModel} labModel
     * @param {VectorSet} cartesianVectorSet1 - the first cartesian vector set. Each scene in 'lab' has 2 vector sets
     * @param {VectorSet} cartesianVectorSet2
     * @param {VectorSet} polarVectorSet1
     * @param {VectorSet} polarVectorSet2
     * @param {Object} [options]
     */
    constructor( labModel, cartesianVectorSet1, cartesianVectorSet2, polarVectorSet1, polarVectorSet2, options ) {


      assert && assert( labModel instanceof LabModel, `invalid explore2DModel: ${labModel}` );
      assert && assert( cartesianVectorSet1 instanceof VectorSet,
        `invalid cartesianVectorSet1: ${cartesianVectorSet1}` );
      assert && assert( cartesianVectorSet2 instanceof VectorSet,
        `invalid cartesianVectorSet2: ${cartesianVectorSet2}` );
      assert && assert( polarVectorSet1 instanceof VectorSet, `invalid polarVectorSet1: ${polarVectorSet1}` );
      assert && assert( polarVectorSet2 instanceof VectorSet, `invalid polarVectorSet2: ${polarVectorSet2}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype,
        `Extra prototype on Options: ${options}` );

      options = _.extend( {}, PANEL_OPTIONS, options );

      //----------------------------------------------------------------------------------------
      // Create the sum check boxes, one for each vector set

      const cartesianSet1SumCheckbox = new SumCheckbox( cartesianVectorSet1.sumVisibleProperty,
        cartesianVectorSet1.vectorGroup );

      const cartesianSet2SumCheckbox = new SumCheckbox( cartesianVectorSet2.sumVisibleProperty,
        cartesianVectorSet2.vectorGroup );

      const polarSet1SumCheckbox = new SumCheckbox( polarVectorSet1.sumVisibleProperty, polarVectorSet1.vectorGroup );

      const polarSet2SumCheckbox = new SumCheckbox( polarVectorSet2.sumVisibleProperty, polarVectorSet2.vectorGroup );

      //----------------------------------------------------------------------------------------
      // Create V Boxes for the 2 check boxes
      const polarCheckboxes = new VBox( _.extend( {}, CONTROL_PANEL_LAYOUT_BOX_OPTIONS, {
        children: [
          polarSet1SumCheckbox,
          polarSet2SumCheckbox
        ]
      } ) );
      const cartesianCheckboxes = new VBox( _.extend( {}, CONTROL_PANEL_LAYOUT_BOX_OPTIONS, {
        children: [
          cartesianSet1SumCheckbox,
          cartesianSet2SumCheckbox
        ]
      } ) );

      //----------------------------------------------------------------------------------------
      // Toggle visibility of the check boxes, never disposed as the panel exists throughout the entire sim
      labModel.coordinateSnapModeProperty.link( ( coordinateSnapMode ) => {

        polarCheckboxes.visible = coordinateSnapMode === CoordinateSnapModes.POLAR;
        cartesianCheckboxes.visible = coordinateSnapMode === CoordinateSnapModes.CARTESIAN;
      } );

      //----------------------------------------------------------------------------------------

      const panelContent = new VBox( {
        spacing: 10,
        align: 'left',
        children: [

          // Sum check boxes
          new Node( {
            children: [ cartesianCheckboxes, polarCheckboxes ]
          } ),

          // Values checkbox
          new Checkbox( new Text( valuesString, { font: PANEL_FONT } ),
            labModel.valuesVisibleProperty,
            CHECKBOX_OPTIONS ),

          // Angles checkbox
          new Checkbox( VectorAdditionIconFactory.createAngleIcon(),
            labModel.angleVisibleProperty,
            CHECKBOX_OPTIONS ),

          // Grid checkbox
          new Checkbox( VectorAdditionIconFactory.createGridIcon(),
            labModel.gridVisibleProperty,
            CHECKBOX_OPTIONS ),
          new Line( 0, 0, PANEL_WIDTH, 0, { stroke: VectorAdditionColors.BLACK } ),
          new Text( componentsString, { font: PANEL_FONT } ),
          new ComponentStyleRadioButtonGroup( labModel.componentStyleProperty )
        ]
      } );

      super( panelContent, options );
    }
  }

  return vectorAddition.register( 'LabGraphControlPanel', LabGraphControlPanel );
} );