// Copyright 2019, University of Colorado Boulder

/**
 * View for the Panel that appears on the upper-right corner of the 'Explore2D' screen. Since there are 2 scenes (polar
 * and cartesian), there are 2 sum visible properties for each.
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
  // const VectorSet = require( 'VECTOR_ADDITION/common/model/VectorSet' );

  // constants
  const CHECKBOX_OPTIONS = VectorAdditionConstants.CHECKBOX_OPTIONS;

  const PANEL_OPTIONS = VectorAdditionConstants.PANEL_OPTIONS;
  const PANEL_FONT = VectorAdditionConstants.PANEL_FONT;

  // strings
  const componentsString = require( 'string!VECTOR_ADDITION/components' );
  const valuesString = require( 'string!VECTOR_ADDITION/values' );

  class LabGraphControlPanel extends Panel {
    /**
     * @constructor
     * @param {VectorSet} cartesianVectorSet1
     * @param {VecotrSet} polarVectorSet
     * @param {Explore2DModel} explore2DModel
     * @param {Object} [options]
     */
    constructor( labModel, cartesianVectorSet1, cartesianVectorSet2, polarVectorSet3, polarVectorSet4, options ) {

      assert && assert( labModel instanceof LabModel, `invalid explore2DModel: ${labModel}` );
      // assert && assert( cartesianVectorSet instanceof VectorSet, `invalid cartesianVectorSet: ${cartesianVectorSet}` );
      // assert && assert( polarVectorSet instanceof VectorSet, `invalid polarVectorSet: ${polarVectorSet}` );
      // assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype,
      //   `Extra prototype on Options: ${options}` );

      //----------------------------------------------------------------------------------------

      options = _.extend( {}, PANEL_OPTIONS, options );

      const cartesianGroup1SumCheckbox = new SumCheckbox( cartesianVectorSet1.sumVisibleProperty, cartesianVectorSet1.vectorGroup );
      const cartesianGroup2SumCheckbox = new SumCheckbox( cartesianVectorSet2.sumVisibleProperty, cartesianVectorSet2.vectorGroup );

      const polarGroup3SumCheckbox = new SumCheckbox( polarVectorSet3.sumVisibleProperty, polarVectorSet3.vectorGroup );
      const polarGroup4SumCheckbox = new SumCheckbox( polarVectorSet4.sumVisibleProperty, polarVectorSet4.vectorGroup );

      const polarCheckboxes = new VBox( {
        spacing: 10,
        align: 'left',
        children: [
          polarGroup3SumCheckbox,
          polarGroup4SumCheckbox
        ]
      } );
      const cartesianCheckboxes = new VBox( {
        spacing: 10,
        align: 'left',
        children: [
          cartesianGroup1SumCheckbox,
          cartesianGroup2SumCheckbox
        ]
      } );
      // Toggle visibility of the check boxes, never disposed as the panel exists throughout the entire sim
      labModel.coordinateSnapModeProperty.link( ( coordinateSnapMode ) => {
        if ( coordinateSnapMode === CoordinateSnapModes.CARTESIAN ) {
          polarCheckboxes.visible = false;
          cartesianCheckboxes.visible = true;
        }

        if ( coordinateSnapMode === CoordinateSnapModes.POLAR ) {
          polarCheckboxes.visible = true;
          cartesianCheckboxes.visible = false;
        }
      } );

      const sumCheckboxes = new Node( {
        children: [ cartesianCheckboxes, polarCheckboxes ]
      } );

      //----------------------------------------------------------------------------------------


      const content = new VBox( {
        spacing: 10,
        align: 'left',
        children: [
          sumCheckboxes,

          // values checkbox
          new Checkbox( new Text( valuesString, { font: PANEL_FONT } ),
            labModel.valuesVisibleProperty,
            CHECKBOX_OPTIONS ),
          // angles checkbox
          new Checkbox( VectorAdditionIconFactory.createAngleIcon(),
            labModel.angleVisibleProperty,
            CHECKBOX_OPTIONS ),
          // grid checkbox
          new Checkbox( VectorAdditionIconFactory.createGridIcon(),
            labModel.gridVisibleProperty,
            CHECKBOX_OPTIONS ),
          new Line( 0, 0, PANEL_OPTIONS.contentWidth, 0, { stroke: VectorAdditionColors.BLACK } ),
          new Text( componentsString, { font: PANEL_FONT } ),
          new ComponentStyleRadioButtonGroup( labModel.componentStyleProperty )
        ]
      } );

      super( content, options );
    }
  }

  return vectorAddition.register( 'LabGraphControlPanel', LabGraphControlPanel );
} );