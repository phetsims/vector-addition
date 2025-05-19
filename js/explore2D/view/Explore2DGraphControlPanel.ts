// Copyright 2019-2025, University of Colorado Boulder

/**
 * Explore1DGraphControlPanel is the graph control panel for the 'Explore 2D' screen.
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
import SumCheckbox from '../../common/view/SumCheckbox.js';
import ValuesCheckbox from '../../common/view/ValuesCheckbox.js';
import VectorAdditionGridCheckbox from '../../common/view/VectorAdditionGridCheckbox.js';
import vectorAddition from '../../vectorAddition.js';
import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import VectorAdditionColors from '../../common/VectorAdditionColors.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Explore2DScene from '../model/Explore2DScene.js';
import VectorAdditionViewProperties from '../../common/view/VectorAdditionViewProperties.js';

type SelfOptions = EmptySelfOptions;

type Explore2DGraphControlPanelOptions = SelfOptions & GraphControlPanelOptions;

export default class Explore2DGraphControlPanel extends GraphControlPanel {

  public constructor( sceneProperty: TReadOnlyProperty<Explore2DScene>,
                      cartesianScene: Explore2DScene,
                      polarScene: Explore2DScene,
                      componentVectorStyleProperty: StringUnionProperty<ComponentVectorStyle>,
                      viewProperties: VectorAdditionViewProperties,
                      providedOptions: Explore2DGraphControlPanelOptions ) {

    const options = providedOptions;

    // Sum checkbox, with vector color determined by the selected scene.
    const sumCheckbox = new SumCheckbox( cartesianScene.vectorSet.sumVisibleProperty, {
      vectorIconFill: new DerivedProperty( [ sceneProperty ], scene =>
        ( scene === cartesianScene ) ? cartesianScene.vectorSet.vectorColorPalette.sumFill : polarScene.vectorSet.vectorColorPalette.sumFill ),
      vectorIconStroke: new DerivedProperty( [ sceneProperty ], scene =>
        ( scene === cartesianScene ) ? cartesianScene.vectorSet.vectorColorPalette.sumStroke : polarScene.vectorSet.vectorColorPalette.sumStroke ),
      tandem: options.tandem.createTandem( 'sumCheckbox' )
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

vectorAddition.register( 'Explore2DGraphControlPanel', Explore2DGraphControlPanel );