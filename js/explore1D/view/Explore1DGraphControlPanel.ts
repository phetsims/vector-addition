// Copyright 2019-2025, University of Colorado Boulder

/**
 * Explore1DGraphControlPanel is the graph control panel for the 'Explore 1D' screen.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import GraphControlPanel, { GraphControlPanelOptions } from '../../common/view/GraphControlPanel.js';
import SumCheckbox from '../../common/view/SumCheckbox.js';
import ValuesCheckbox from '../../common/view/ValuesCheckbox.js';
import VectorAdditionGridCheckbox from '../../common/view/VectorAdditionGridCheckbox.js';
import vectorAddition from '../../vectorAddition.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Explore1DScene from '../model/Explore1DScene.js';
import Explore2DViewProperties from '../../explore2D/view/Explore2DViewProperties.js';

type SelfOptions = EmptySelfOptions;

type Explore1DGraphControlPanelOptions = SelfOptions & GraphControlPanelOptions;

export default class Explore1DGraphControlPanel extends GraphControlPanel {

  public constructor( sceneProperty: TReadOnlyProperty<Explore1DScene>,
                      horizontalScene: Explore1DScene,
                      verticalScene: Explore1DScene,
                      viewProperties: Explore2DViewProperties,
                      providedOptions: Explore1DGraphControlPanelOptions ) {

    const options = providedOptions;

    // Sum checkbox, with vector color determined by the selected scene.
    const sumCheckbox = new SumCheckbox( viewProperties.sumVisibleProperty, {
      vectorIconFill: new DerivedProperty( [
        sceneProperty,
        horizontalScene.vectorSet.vectorColorPalette.sumFillProperty,
        verticalScene.vectorSet.vectorColorPalette.sumFillProperty
      ], scene => scene.vectorSet.vectorColorPalette.sumFillProperty.value ),
      vectorIconStroke: new DerivedProperty( [
        sceneProperty,
        horizontalScene.vectorSet.vectorColorPalette.sumStrokeProperty,
        verticalScene.vectorSet.vectorColorPalette.sumStrokeProperty
      ], scene => scene.vectorSet.vectorColorPalette.sumStrokeProperty.value ),
      tandem: options.tandem.createTandem( 'sumCheckbox' )
    } );

    // Values
    const valuesCheckbox = new ValuesCheckbox( viewProperties.valuesVisibleProperty,
      options.tandem.createTandem( 'valuesCheckbox' ) );

    // Grid
    const gridCheckbox = new VectorAdditionGridCheckbox( viewProperties.gridVisibleProperty,
      options.tandem.createTandem( 'gridCheckbox' ) );

    const content = new VBox( {
      spacing: VectorAdditionConstants.CHECKBOX_Y_SPACING,
      align: 'left',
      stretch: true,
      children: [
        sumCheckbox,
        valuesCheckbox,
        gridCheckbox
      ]
    } );

    super( content, options );
  }
}

vectorAddition.register( 'Explore1DGraphControlPanel', Explore1DGraphControlPanel );