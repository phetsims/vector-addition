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
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import AnglesCheckbox from '../../common/view/AnglesCheckbox.js';
import ComponentStyleControl from '../../common/view/ComponentStyleControl.js';
import GraphControlPanel, { GraphControlPanelOptions } from '../../common/view/GraphControlPanel.js';
import ValuesCheckbox from '../../common/view/ValuesCheckbox.js';
import VectorAdditionGridCheckbox from '../../common/view/VectorAdditionGridCheckbox.js';
import VectorAdditionViewProperties from '../../common/view/VectorAdditionViewProperties.js';
import VectorCheckbox from '../../common/view/VectorCheckbox.js';
import vectorAddition from '../../vectorAddition.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ComponentVectorStyles from '../../common/model/ComponentVectorStyles.js';
import EquationsVectorSet from '../model/EquationsVectorSet.js';

type SelfOptions = EmptySelfOptions;

type EquationsGraphControlPanelOptions = SelfOptions & GraphControlPanelOptions;

export default class EquationsGraphControlPanel extends GraphControlPanel {

  public constructor( cartesianVectorSet: EquationsVectorSet,
                      polarVectorSet: EquationsVectorSet,
                      componentStyleProperty: EnumerationProperty<ComponentVectorStyles>,
                      viewProperties: VectorAdditionViewProperties,
                      providedOptions?: EquationsGraphControlPanelOptions ) {

    const options = providedOptions;

    // 'c' checkbox
    const cartesianSumVector = cartesianVectorSet.sumVector!;
    assert && assert( cartesianSumVector );
    const cartesianSumSymbol = cartesianSumVector.symbol!;
    assert && assert( cartesianSumSymbol );
    const cartesianVectorCheckbox = new VectorCheckbox( cartesianVectorSet.sumVisibleProperty, cartesianSumSymbol, {
      vectorFill: cartesianVectorSet.vectorColorPalette.sumFill,
      vectorStroke: cartesianVectorSet.vectorColorPalette.sumStroke
    } );

    // 'f' checkbox
    const polarSumVector = polarVectorSet.sumVector!;
    assert && assert( polarSumVector );
    const polarSumSymbol = polarSumVector.symbol!;
    assert && assert( polarSumSymbol );
    const polarVectorCheckbox = new VectorCheckbox( polarVectorSet.sumVisibleProperty, polarSumSymbol, {
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
      new ComponentStyleControl( componentStyleProperty )

    ], options );
  }
}

vectorAddition.register( 'EquationsGraphControlPanel', EquationsGraphControlPanel );