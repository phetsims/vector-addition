// Copyright 2019-2025, University of Colorado Boulder

/**
 * EquationsGraphControlPanel is the graph control panel for the 'Equations' screen.
 * It exists for the lifetime of the sim and is not intended to be disposed.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import AlignBox from '../../../../scenery/js/layout/nodes/AlignBox.js';
import HSeparator from '../../../../scenery/js/layout/nodes/HSeparator.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import AnglesCheckbox from '../../common/view/AnglesCheckbox.js';
import ComponentVectorStyleControl from '../../common/view/ComponentVectorStyleControl.js';
import GraphControlPanel, { GraphControlPanelOptions } from '../../common/view/GraphControlPanel.js';
import ValuesCheckbox from '../../common/view/ValuesCheckbox.js';
import VectorAdditionGridCheckbox from '../../common/view/VectorAdditionGridCheckbox.js';
import VectorAdditionViewProperties from '../../common/view/VectorAdditionViewProperties.js';
import VectorCheckbox from '../../common/view/VectorCheckbox.js';
import vectorAddition from '../../vectorAddition.js';
import EquationsVectorSet from '../model/EquationsVectorSet.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import VectorAdditionColors from '../../common/VectorAdditionColors.js';

type SelfOptions = EmptySelfOptions;

type EquationsGraphControlPanelOptions = SelfOptions & GraphControlPanelOptions;

export default class EquationsGraphControlPanel extends GraphControlPanel {

  public constructor( cartesianVectorSet: EquationsVectorSet,
                      polarVectorSet: EquationsVectorSet,
                      componentVectorStyleProperty: StringUnionProperty<ComponentVectorStyle>,
                      viewProperties: VectorAdditionViewProperties,
                      providedOptions: EquationsGraphControlPanelOptions ) {

    const options = providedOptions;

    // 'c' checkbox
    const cartesianSumVector = cartesianVectorSet.sumVector!;
    assert && assert( cartesianSumVector );
    const cartesianSumSymbolProperty = cartesianSumVector.symbolProperty!;
    assert && assert( cartesianSumSymbolProperty );
    const cartesianVectorCheckbox = new VectorCheckbox( cartesianVectorSet.sumVisibleProperty, cartesianSumSymbolProperty, {
      vectorFill: cartesianVectorSet.vectorColorPalette.sumFill,
      vectorStroke: cartesianVectorSet.vectorColorPalette.sumStroke,
      tandem: options.tandem.createTandem( 'cartesianVectorCheckbox' )
    } );

    // 'f' checkbox
    const polarSumVector = polarVectorSet.sumVector!;
    assert && assert( polarSumVector );
    const polarSumSymbolProperty = polarSumVector.symbolProperty!;
    assert && assert( polarSumSymbolProperty );
    const polarVectorCheckbox = new VectorCheckbox( polarVectorSet.sumVisibleProperty, polarSumSymbolProperty, {
      vectorFill: polarVectorSet.vectorColorPalette.sumFill,
      vectorStroke: polarVectorSet.vectorColorPalette.sumStroke,
      tandem: options.tandem.createTandem( 'polarVectorCheckbox' )
    } );

    // Show the vector checkbox ('c' or 'f') that matches the selected scene.
    // unlink is unnecessary, exists for the lifetime of the sim.
    viewProperties.coordinateSnapModeProperty.link( coordinateSnapMode => {
      cartesianVectorCheckbox.visible = ( coordinateSnapMode === 'cartesian' );
      polarVectorCheckbox.visible = ( coordinateSnapMode === 'polar' );
    } );

    // To make all checkboxes the same height
    const alignBoxOptions = {
      group: new AlignGroup( {
        matchHorizontal: false,
        matchVertical: true
      } )
    };

    // Values
    const valuesCheckbox = new ValuesCheckbox( viewProperties.valuesVisibleProperty,
      options.tandem.createTandem( 'valuesCheckbox' ) );

    // Angles
    const anglesCheckbox = new AnglesCheckbox( viewProperties.anglesVisibleProperty,
      options.tandem.createTandem( 'anglesCheckbox' ) );

    // Grid
    const gridCheckbox = new VectorAdditionGridCheckbox( viewProperties.gridVisibleProperty,
      options.tandem.createTandem( 'gridCheckbox' ) );

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
      new HSeparator( { stroke: VectorAdditionColors.SEPARATOR_STROKE } ),

      // Radio buttons for selection component vector style
      new ComponentVectorStyleControl( componentVectorStyleProperty, options.tandem.createTandem( 'componentVectorStyleControl' ) )

    ], options );
  }
}

vectorAddition.register( 'EquationsGraphControlPanel', EquationsGraphControlPanel );