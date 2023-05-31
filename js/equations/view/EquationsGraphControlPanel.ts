// Copyright 2019-2023, University of Colorado Boulder

/**
 * EquationsGraphControlPanel is the graph control panel for the 'Equations' screen.
 * It exists for the lifetime of the sim and is not intended to be disposed.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import { AlignBox, AlignGroup, Color, HSeparator, Node, VBox } from '../../../../scenery/js/imports.js';
import CoordinateSnapModes from '../../common/model/CoordinateSnapModes.js';
import VectorSet from '../../common/model/VectorSet.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import AnglesCheckbox from '../../common/view/AnglesCheckbox.js';
import ComponentStyleControl from '../../common/view/ComponentStyleControl.js';
import GraphControlPanel from '../../common/view/GraphControlPanel.js';
import ValuesCheckbox from '../../common/view/ValuesCheckbox.js';
import VectorAdditionGridCheckbox from '../../common/view/VectorAdditionGridCheckbox.js';
import VectorAdditionViewProperties from '../../common/view/VectorAdditionViewProperties.js';
import VectorCheckbox from '../../common/view/VectorCheckbox.js';
import vectorAddition from '../../vectorAddition.js';

export default class EquationsGraphControlPanel extends GraphControlPanel {

  /**
   * @param {VectorSet} cartesianVectorSet
   * @param {VectorSet} polarVectorSet
   * @param {EnumerationProperty.<ComponentVectorStyles>} componentStyleProperty
   * @param {VectorAdditionViewProperties} viewProperties
   * @param {Object} [options]
   */
  constructor( cartesianVectorSet, polarVectorSet, componentStyleProperty, viewProperties, options ) {

    assert && assert( cartesianVectorSet instanceof VectorSet, `invalid cartesianVectorSet: ${cartesianVectorSet}` );
    assert && assert( polarVectorSet instanceof VectorSet, `invalid polarVectorSet: ${polarVectorSet}` );
    assert && assert( componentStyleProperty instanceof EnumerationProperty, `invalid componentStyleProperty: ${componentStyleProperty}` );
    assert && assert( viewProperties instanceof VectorAdditionViewProperties, `invalid viewProperties: ${viewProperties}` );

    // 'c' checkbox
    const cartesianVectorCheckbox = new VectorCheckbox( cartesianVectorSet.sumVisibleProperty,
      cartesianVectorSet.sumVector.symbol, {
        vectorFill: cartesianVectorSet.vectorColorPalette.sumFill,
        vectorStroke: cartesianVectorSet.vectorColorPalette.sumStroke
      } );

    // 'f' checkbox
    const polarVectorCheckbox = new VectorCheckbox( polarVectorSet.sumVisibleProperty,
      polarVectorSet.sumVector.symbol, {
        vectorFill: polarVectorSet.vectorColorPalette.sumFill,
        vectorStroke: polarVectorSet.vectorColorPalette.sumStroke
      } );

    // Show the vector checkbox ('c' or 'f') that matches the selected scene.
    // unlink is unnecessary, exists for the lifetime of the sim.
    viewProperties.coordinateSnapModeProperty.link( coordinateSnapMode => {
      cartesianVectorCheckbox.visible = ( coordinateSnapMode === CoordinateSnapModes.CARTESIAN );
      polarVectorCheckbox.visible = ( coordinateSnapMode === CoordinateSnapModes.POLAR );
    } );

    // To make all checkboxes the same height
    const alignBoxOptions = {
      group: new AlignGroup( {
        matchHorizontal: false,
        matchVertical: true
      } )
    };

    // Values
    const valuesCheckbox = new ValuesCheckbox( viewProperties.valuesVisibleProperty );

    // Angles
    const anglesCheckbox = new AnglesCheckbox( viewProperties.anglesVisibleProperty );

    // Grid
    const gridCheckbox = new VectorAdditionGridCheckbox( viewProperties.gridVisibleProperty );

    super( [

      // checkboxes, wrapped with AlignBox so that they are all the same height
      new VBox( {
        spacing: VectorAdditionConstants.CHECKBOX_Y_SPACING,
        align: 'left',
        children: [
          new Node( {
            children: [
              new AlignBox( cartesianVectorCheckbox, alignBoxOptions ),
              new AlignBox( polarVectorCheckbox, alignBoxOptions )
            ]
          } ),
          new AlignBox( valuesCheckbox, alignBoxOptions ),
          new AlignBox( anglesCheckbox, alignBoxOptions ),
          new AlignBox( gridCheckbox, alignBoxOptions )
        ]
      } ),

      // separator
      new HSeparator( { stroke: Color.BLACK } ),

      // Components radio buttons
      new ComponentStyleControl( componentStyleProperty, {
        maxWidth: VectorAdditionConstants.GRAPH_CONTROL_PANEL_CONTENT_WIDTH
      } )

    ], options );
  }
}

vectorAddition.register( 'EquationsGraphControlPanel', EquationsGraphControlPanel );