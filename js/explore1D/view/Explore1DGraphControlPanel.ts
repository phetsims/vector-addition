// Copyright 2019-2025, University of Colorado Boulder

/**
 * Explore1DGraphControlPanel is the graph control panel for the 'Explore 1D' screen.
 * It exists for the lifetime of the sim and is not intended to be disposed.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import AlignBox from '../../../../scenery/js/layout/nodes/AlignBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import VectorSet from '../../common/model/VectorSet.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import GraphControlPanel, { GraphControlPanelOptions } from '../../common/view/GraphControlPanel.js';
import SumCheckbox from '../../common/view/SumCheckbox.js';
import ValuesCheckbox from '../../common/view/ValuesCheckbox.js';
import VectorAdditionGridCheckbox from '../../common/view/VectorAdditionGridCheckbox.js';
import vectorAddition from '../../vectorAddition.js';
import Explore1DViewProperties from './Explore1DViewProperties.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Explore1DScene from '../model/Explore1DScene.js';

type SelfOptions = EmptySelfOptions;

type Explore1DGraphControlPanelOptions = SelfOptions & GraphControlPanelOptions;

export default class Explore1DGraphControlPanel extends GraphControlPanel {

  public constructor( horizontalVectorSet: VectorSet,
                      verticalVectorSet: VectorSet,
                      sceneProperty: TReadOnlyProperty<Explore1DScene>,
                      viewProperties: Explore1DViewProperties,
                      providedOptions: Explore1DGraphControlPanelOptions ) {

    const options = providedOptions;

    // Sum checkbox, with vector color determined by graph orientation.
    const sumCheckbox = new SumCheckbox( horizontalVectorSet.sumVisibleProperty, {
      vectorIconFill: new DerivedProperty( [ sceneProperty ], scene =>
        scene.graph.orientation === 'horizontal' ? horizontalVectorSet.vectorColorPalette.sumFill : verticalVectorSet.vectorColorPalette.sumFill ),
      vectorIconStroke: new DerivedProperty( [ sceneProperty ], scene =>
        scene.graph.orientation === 'horizontal' ? horizontalVectorSet.vectorColorPalette.sumStroke : verticalVectorSet.vectorColorPalette.sumStroke ),
      tandem: options.tandem.createTandem( 'sumCheckbox' )
    } );

    // Values
    const valuesCheckbox = new ValuesCheckbox( viewProperties.valuesVisibleProperty,
      options.tandem.createTandem( 'valuesCheckbox' ) );

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

      // Checkboxes
      new VBox( {
        spacing: VectorAdditionConstants.CHECKBOX_Y_SPACING,
        align: 'left',
        children: [
          new AlignBox( sumCheckbox, alignBoxOptions ),
          new AlignBox( valuesCheckbox, alignBoxOptions ),
          new AlignBox( gridCheckbox, alignBoxOptions )
        ]
      } )
    ], options );
  }
}

vectorAddition.register( 'Explore1DGraphControlPanel', Explore1DGraphControlPanel );