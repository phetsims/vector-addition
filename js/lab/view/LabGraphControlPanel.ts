// Copyright 2019-2025, University of Colorado Boulder

/**
 *  LabGraphControlPanel is the graph control panel for the 'Lab' screen.
 *  It exists for the lifetime of the sim and is not intended to be disposed.
 *
 *  @author Brandon Li
 *  @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import AlignBox from '../../../../scenery/js/layout/nodes/AlignBox.js';
import HSeparator from '../../../../scenery/js/layout/nodes/HSeparator.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import AnglesCheckbox from '../../common/view/AnglesCheckbox.js';
import ComponentVectorStyleControl from '../../common/view/ComponentVectorStyleControl.js';
import GraphControlPanel, { GraphControlPanelOptions } from '../../common/view/GraphControlPanel.js';
import SumCheckbox from '../../common/view/SumCheckbox.js';
import ValuesCheckbox from '../../common/view/ValuesCheckbox.js';
import VectorAdditionGridCheckbox from '../../common/view/VectorAdditionGridCheckbox.js';
import vectorAddition from '../../vectorAddition.js';
import LabScene from '../model/LabScene.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import VectorAdditionColors from '../../common/VectorAdditionColors.js';
import LabViewProperties from './LabViewProperties.js';

type SelfOptions = EmptySelfOptions;

type LabGraphControlPanelOptions = SelfOptions & GraphControlPanelOptions;

export default class LabGraphControlPanel extends GraphControlPanel {

  public constructor( cartesianGraph: LabScene,
                      polarGraph: LabScene,
                      componentVectorStyleProperty: StringUnionProperty<ComponentVectorStyle>,
                      sum1VisibleProperty: Property<boolean>,
                      sum2VisibleProperty: Property<boolean>,
                      viewProperties: LabViewProperties,
                      providedOptions: LabGraphControlPanelOptions ) {

    const options = providedOptions;

    const sum1Checkbox = new SumCheckbox( sum1VisibleProperty, {
      vectorIconFill: new DerivedProperty( [ viewProperties.coordinateSnapModeProperty ], coordinateSnapMode =>
        ( coordinateSnapMode === cartesianGraph.coordinateSnapMode ) ?
        cartesianGraph.vectorSet1.vectorColorPalette.sumFill : polarGraph.vectorSet1.vectorColorPalette.sumFill ),
      vectorIconStroke: new DerivedProperty( [ viewProperties.coordinateSnapModeProperty ], coordinateSnapMode =>
        ( coordinateSnapMode === cartesianGraph.coordinateSnapMode ) ?
        cartesianGraph.vectorSet1.vectorColorPalette.sumStroke : polarGraph.vectorSet1.vectorColorPalette.sumStroke ),
      tandem: options.tandem.createTandem( 'sum1Checkbox' )
    } );

    const sum2Checkbox = new SumCheckbox( sum2VisibleProperty, {
      vectorIconFill: new DerivedProperty( [ viewProperties.coordinateSnapModeProperty ], coordinateSnapMode =>
        ( coordinateSnapMode === cartesianGraph.coordinateSnapMode ) ?
        cartesianGraph.vectorSet2.vectorColorPalette.sumFill : polarGraph.vectorSet2.vectorColorPalette.sumFill ),
      vectorIconStroke: new DerivedProperty( [ viewProperties.coordinateSnapModeProperty ], coordinateSnapMode =>
        ( coordinateSnapMode === cartesianGraph.coordinateSnapMode ) ?
        cartesianGraph.vectorSet2.vectorColorPalette.sumStroke : polarGraph.vectorSet2.vectorColorPalette.sumStroke ),
      tandem: options.tandem.createTandem( 'sum2Checkbox' )
    } );

    // Values
    const valuesCheckbox = new ValuesCheckbox( viewProperties.valuesVisibleProperty,
      options.tandem.createTandem( 'valuesCheckbox' ) );

    // Angles
    const anglesCheckbox = new AnglesCheckbox( viewProperties.anglesVisibleProperty,
      options.tandem.createTandem( 'anglesCheckbox' ) );

    // Grid
    const gridCheckbox = new VectorAdditionGridCheckbox( viewProperties.gridVisibleProperty,
      options.tandem.createTandem( 'gridCheckbox' ) );

    // To make all checkboxes have the same effective height
    const alignBoxOptions = {
      group: new AlignGroup( {
        matchHorizontal: false,
        matchVertical: true
      } )
    };

    super( [

      // checkboxes, wrapped with AlignBox so that they are all the same height
      new VBox( {
        spacing: VectorAdditionConstants.CHECKBOX_Y_SPACING,
        align: 'left',
        children: [
          new AlignBox( sum1Checkbox, alignBoxOptions ),
          new AlignBox( sum2Checkbox, alignBoxOptions ),
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

vectorAddition.register( 'LabGraphControlPanel', LabGraphControlPanel );