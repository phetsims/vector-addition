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
  const Explore2DModel = require( 'VECTOR_ADDITION/explore2D/model/Explore2DModel' );
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

  // constants
  const CHECKBOX_OPTIONS = VectorAdditionConstants.CHECKBOX_OPTIONS;

  const PANEL_OPTIONS = VectorAdditionConstants.PANEL_OPTIONS;
  const PANEL_FONT = VectorAdditionConstants.PANEL_FONT;

  // strings
  const componentsString = require( 'string!VECTOR_ADDITION/components' );
  const valuesString = require( 'string!VECTOR_ADDITION/values' );

  class Explore2DGraphControlPanel extends Panel {
    /**
     * @constructor
     * @param {VectorSet} cartesianVectorSet
     * @param {VecotrSet} polarVectorSet
     * @param {Explore2DModel} explore2DModel
     * @param {Object} [options]
     */
    constructor( explore2DModel, cartesianVectorSet, polarVectorSet, options ) {

      assert && assert( explore2DModel instanceof Explore2DModel, `invalid explore2DModel: ${explore2DModel}` );
      assert && assert( cartesianVectorSet instanceof VectorSet, `invalid cartesianVectorSet: ${cartesianVectorSet}` );
      assert && assert( polarVectorSet instanceof VectorSet, `invalid polarVectorSet: ${polarVectorSet}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype,
        `Extra prototype on Options: ${options}` );

      //----------------------------------------------------------------------------------------

      options = _.extend( PANEL_OPTIONS, options );

      const cartesianSumCheckbox = new SumCheckbox( cartesianVectorSet );
      const polarSumCheckbox = new SumCheckbox( polarVectorSet );

      // Toggle visibility of the check boxes, never disposed as the panel exists throughout the entire sim
      explore2DModel.coordinateSnapModeProperty.link( ( coordinateSnapMode ) => {
        if ( coordinateSnapMode === CoordinateSnapModes.CARTESIAN ) {
          polarSumCheckbox.visible = false;
          cartesianSumCheckbox.visible = true;
        }

        if ( coordinateSnapMode === CoordinateSnapModes.POLAR ) {
          polarSumCheckbox.visible = true;
          cartesianSumCheckbox.visible = false;
        }
      } );

      const sumCheckboxes = new Node( {
        children: [ cartesianSumCheckbox, polarSumCheckbox ]
      } );

      //----------------------------------------------------------------------------------------


      const content = new VBox( {
        spacing: 10,
        align: 'left',
        children: [
          sumCheckboxes,

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
          new Line( 0, 0, PANEL_OPTIONS.contentWidth, 0, { stroke: VectorAdditionColors.BLACK } ),
          new Text( componentsString, { font: PANEL_FONT } ),
          new ComponentStyleRadioButtonGroup( explore2DModel.componentStyleProperty )
        ]
      } );

      super( content, options );
    }
  }

  return vectorAddition.register( 'Explore2DGraphControlPanel', Explore2DGraphControlPanel );
} );