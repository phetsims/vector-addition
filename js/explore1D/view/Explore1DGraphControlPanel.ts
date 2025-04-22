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
import Node from '../../../../scenery/js/nodes/Node.js';
import GraphOrientation from '../../common/model/GraphOrientation.js';
import VectorSet from '../../common/model/VectorSet.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import GraphControlPanel, { GraphControlPanelOptions } from '../../common/view/GraphControlPanel.js';
import SumCheckbox from '../../common/view/SumCheckbox.js';
import ValuesCheckbox from '../../common/view/ValuesCheckbox.js';
import VectorAdditionGridCheckbox from '../../common/view/VectorAdditionGridCheckbox.js';
import vectorAddition from '../../vectorAddition.js';
import Explore1DViewProperties from './Explore1DViewProperties.js';

type SelfOptions = EmptySelfOptions;

type Explore1DGraphControlPanelOptions = SelfOptions & GraphControlPanelOptions;

export default class Explore1DGraphControlPanel extends GraphControlPanel {

  public constructor( horizontalVectorSet: VectorSet,
                      verticalVectorSet: VectorSet,
                      viewProperties: Explore1DViewProperties,
                      providedOptions: Explore1DGraphControlPanelOptions ) {

    const options = providedOptions;

    // To make all checkboxes the same height
    const alignBoxOptions = {
      group: new AlignGroup( {
        matchHorizontal: false,
        matchVertical: true
      } )
    };

    const sumCheckboxesTandem = options.tandem.createTandem( 'sumCheckboxes' );

    const horizontalSumCheckbox = new SumCheckbox( horizontalVectorSet.sumVisibleProperty,
      horizontalVectorSet.vectorColorPalette, sumCheckboxesTandem.createTandem( 'horizontalSumCheckbox' ) );

    const verticalSumCheckbox = new SumCheckbox( verticalVectorSet.sumVisibleProperty,
      verticalVectorSet.vectorColorPalette, sumCheckboxesTandem.createTandem( 'verticalSumCheckbox' ) );

    const sumCheckboxes = new Node( {
      children: [
        new AlignBox( horizontalSumCheckbox, alignBoxOptions ),
        new AlignBox( verticalSumCheckbox, alignBoxOptions )
      ],
      tandem: sumCheckboxesTandem
    } );

    // Show the Sum checkbox that matches the selected scene.
    // unlink is unnecessary, exists for the lifetime of the sim.
    viewProperties.graphOrientationProperty.link( gridOrientation => {
      horizontalSumCheckbox.visible = ( gridOrientation === GraphOrientation.HORIZONTAL );
      verticalSumCheckbox.visible = ( gridOrientation === GraphOrientation.VERTICAL );
    } );

    // Values
    const valuesCheckbox = new ValuesCheckbox( viewProperties.valuesVisibleProperty,
      options.tandem.createTandem( 'valuesCheckbox' ) );

    // Grid
    const gridCheckbox = new VectorAdditionGridCheckbox( viewProperties.gridVisibleProperty,
      options.tandem.createTandem( 'gridCheckbox' ) );

    super( [

      // checkboxes, wrapped with AlignBox so that they are all the same height
      new VBox( {
        spacing: VectorAdditionConstants.CHECKBOX_Y_SPACING,
        align: 'left',
        children: [
          sumCheckboxes,
          new AlignBox( valuesCheckbox, alignBoxOptions ),
          new AlignBox( gridCheckbox, alignBoxOptions )
        ]
      } )
    ], options );
  }
}

vectorAddition.register( 'Explore1DGraphControlPanel', Explore1DGraphControlPanel );