// Copyright 2019-2025, University of Colorado Boulder

/**
 * EquationsGraphControlPanel is the graph control panel for the 'Equations' screen.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import HSeparator from '../../../../scenery/js/layout/nodes/HSeparator.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import AnglesCheckbox from '../../common/view/AnglesCheckbox.js';
import ComponentsControl from '../../common/view/ComponentsControl.js';
import GraphControlPanel, { GraphControlPanelOptions } from '../../common/view/GraphControlPanel.js';
import ValuesCheckbox from '../../common/view/ValuesCheckbox.js';
import VectorAdditionGridCheckbox from '../../common/view/VectorAdditionGridCheckbox.js';
import vectorAddition from '../../vectorAddition.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import VectorAdditionColors from '../../common/VectorAdditionColors.js';
import EquationsViewProperties from './EquationsViewProperties.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import EquationsScene from '../model/EquationsScene.js';
import EquationsSumCheckbox from './EquationsSumCheckbox.js';
import Property from '../../../../axon/js/Property.js';

type SelfOptions = EmptySelfOptions;

type EquationsGraphControlPanelOptions = SelfOptions & GraphControlPanelOptions;

export default class EquationsGraphControlPanel extends GraphControlPanel {

  public constructor( sceneProperty: TReadOnlyProperty<EquationsScene>,
                      cartesianScene: EquationsScene,
                      polarScene: EquationsScene,
                      sumVisibleProperty: Property<boolean>,
                      componentVectorStyleProperty: StringUnionProperty<ComponentVectorStyle>,
                      viewProperties: EquationsViewProperties,
                      providedOptions: EquationsGraphControlPanelOptions ) {

    const options = providedOptions;

    // Sum, 'c' or 'f'
    const sumCheckbox = new EquationsSumCheckbox( sumVisibleProperty, sceneProperty, cartesianScene, polarScene,
      options.tandem.createTandem( 'sumCheckbox' ) );

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
      spacing: VectorAdditionConstants.GRAPH_CONTROL_PANEL_Y_SPACING,
      align: 'left',
      stretch: true,
      children: [

        // Checkboxes
        sumCheckbox,
        valuesCheckbox,
        anglesCheckbox,
        gridCheckbox,

        // separator
        new HSeparator( { stroke: VectorAdditionColors.SEPARATOR_STROKE } ),

        // Radio button group
        new ComponentsControl( componentVectorStyleProperty, options.tandem.createTandem( 'componentsControl' ) )
      ]
    } );

    super( content, options );
  }
}

vectorAddition.register( 'EquationsGraphControlPanel', EquationsGraphControlPanel );