// Copyright 2019-2025, University of Colorado Boulder

/**
 *  LabGraphControlPanel is the graph control panel for the 'Lab' screen.
 *
 *  @author Brandon Li
 *  @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import HSeparator from '../../../../scenery/js/layout/nodes/HSeparator.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import AnglesCheckbox from '../../common/view/AnglesCheckbox.js';
import ComponentsControl from '../../common/view/ComponentsControl.js';
import GraphControlPanel, { GraphControlPanelOptions } from '../../common/view/GraphControlPanel.js';
import SumCheckbox from '../../common/view/SumCheckbox.js';
import ValuesCheckbox from '../../common/view/ValuesCheckbox.js';
import VectorAdditionGridCheckbox from '../../common/view/VectorAdditionGridCheckbox.js';
import vectorAddition from '../../vectorAddition.js';
import LabScene from '../model/LabScene.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import VectorAdditionColors from '../../common/VectorAdditionColors.js';
import VectorAdditionStrings from '../../VectorAdditionStrings.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import DerivedStringProperty from '../../../../axon/js/DerivedStringProperty.js';
import VectorAdditionSymbols from '../../common/VectorAdditionSymbols.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import LabViewProperties from './LabViewProperties.js';

type SelfOptions = EmptySelfOptions;

type LabGraphControlPanelOptions = SelfOptions & GraphControlPanelOptions;

export default class LabGraphControlPanel extends GraphControlPanel {

  public constructor( sceneProperty: Property<LabScene>,
                      cartesianScene: LabScene,
                      polarScene: LabScene,
                      componentVectorStyleProperty: StringUnionProperty<ComponentVectorStyle>,
                      viewProperties: LabViewProperties,
                      providedOptions: LabGraphControlPanelOptions ) {

    const options = providedOptions;

    // Symbol for the selected vector set 1.
    const vectorSet1SymbolProperty = new DerivedStringProperty(
      [ sceneProperty, cartesianScene.vectorSet1.symbolProperty, polarScene.vectorSet1.symbolProperty ],
      scene => scene.vectorSet1.symbolProperty.value
    );

    // Symbol for the selected vector set 2.
    const vectorSet2SymbolProperty = new DerivedStringProperty(
      [ sceneProperty, cartesianScene.vectorSet2.symbolProperty, polarScene.vectorSet2.symbolProperty ],
      scene => scene.vectorSet2.symbolProperty.value
    );

    // Sum symbol for vector set 1 is based on the selected scene and dynamic string dependencies.
    const sum1SymbolProperty = new DerivedProperty( [ VectorAdditionSymbols.sStringProperty, vectorSet1SymbolProperty ],
      ( sString, subscriptString ) => `${sString}<sub>${subscriptString}</sub>` );

    // Sum symbol for vector set 2 is based on the selected scene and dynamic string dependencies.
    const sum2SymbolProperty = new DerivedProperty( [ VectorAdditionSymbols.sStringProperty, vectorSet2SymbolProperty ],
      ( sString, subscriptString ) => `${sString}<sub>${subscriptString}</sub>` );

    // To left-align vector icons for the 2 sum checkboxes.
    const alignGroup = new AlignGroup();

    // Sum checkbox for vector set 1, with vector symbol and color determined by the selected scene.
    const sum1Checkbox = new SumCheckbox( viewProperties.sum1VisibleProperty, {
      sumSymbolProperty: sum1SymbolProperty,
      sumSymbolDescriptionProperty: new PatternStringProperty( VectorAdditionStrings.a11y.symbolWithSubscriptDescriptionStringProperty, {
        symbol: VectorAdditionSymbols.sStringProperty,
        subscript: vectorSet1SymbolProperty
      } ),
      vectorIconFill: new DerivedProperty( [
        sceneProperty,
        cartesianScene.vectorSet1.vectorColorPalette.sumFillProperty,
        polarScene.vectorSet1.vectorColorPalette.sumFillProperty
      ], scene => scene.vectorSet1.vectorColorPalette.sumFillProperty.value ),
      vectorIconStroke: new DerivedProperty( [
        sceneProperty,
        cartesianScene.vectorSet1.vectorColorPalette.sumStrokeProperty,
        polarScene.vectorSet1.vectorColorPalette.sumStrokeProperty
      ], scene => scene.vectorSet1.vectorColorPalette.sumStrokeProperty.value ),
      alignGroup: alignGroup,

      // "Vector Sum for Set {{vectorSetSymbol}}"
      accessibleName: new PatternStringProperty( VectorAdditionStrings.a11y.labSumCheckbox.accessibleNameStringProperty, {
        vectorSetSymbol: vectorSet1SymbolProperty
      } ),
      tandem: options.tandem.createTandem( 'sum1Checkbox' )
    } );

    // Sum checkbox for vector set 2, with vector symbol and color determined by the selected scene.
    const sum2Checkbox = new SumCheckbox( viewProperties.sum2VisibleProperty, {
      sumSymbolProperty: sum2SymbolProperty,
      sumSymbolDescriptionProperty: new PatternStringProperty( VectorAdditionStrings.a11y.symbolWithSubscriptDescriptionStringProperty, {
        symbol: VectorAdditionSymbols.sStringProperty,
        subscript: vectorSet2SymbolProperty
      } ),
      vectorIconFill: new DerivedProperty( [
        sceneProperty,
        cartesianScene.vectorSet2.vectorColorPalette.sumFillProperty,
        polarScene.vectorSet2.vectorColorPalette.sumFillProperty
      ], scene => scene.vectorSet2.vectorColorPalette.sumFillProperty.value ),
      vectorIconStroke: new DerivedProperty( [
        sceneProperty,
        cartesianScene.vectorSet2.vectorColorPalette.sumStrokeProperty,
        polarScene.vectorSet2.vectorColorPalette.sumStrokeProperty
      ], scene => scene.vectorSet2.vectorColorPalette.sumStrokeProperty.value ),
      alignGroup: alignGroup,

      // "Vector Sum for Set {{vectorSetSymbol}}"
      accessibleName: new PatternStringProperty( VectorAdditionStrings.a11y.labSumCheckbox.accessibleNameStringProperty, {
        vectorSetSymbol: vectorSet2SymbolProperty
      } ),
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

    const content = new VBox( {
      spacing: VectorAdditionConstants.CHECKBOX_Y_SPACING,
      align: 'left',
      stretch: true,
      resize: false, // because the height of the Sum checkboxes will change depending on which scene is selected.
      children: [

        // Checkboxes
        sum1Checkbox,
        sum2Checkbox,
        valuesCheckbox,
        anglesCheckbox,
        gridCheckbox,

        // separator
        new HSeparator( { stroke: VectorAdditionColors.separatorStrokeProperty } ),

        // Radio button group
        new ComponentsControl( componentVectorStyleProperty, options.tandem.createTandem( 'componentsControl' ) )
      ]
    } );

    super( content, options );
  }
}

vectorAddition.register( 'LabGraphControlPanel', LabGraphControlPanel );