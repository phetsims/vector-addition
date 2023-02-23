// Copyright 2019-2023, University of Colorado Boulder

/**
 * Explore1DGraphControlPanel is the graph control panel for the 'Explore 1D' screen.
 * It exists for the lifetime of the sim and is not intended to be disposed.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { AlignBox, AlignGroup, Node, VBox } from '../../../../scenery/js/imports.js';
import GraphOrientations from '../../common/model/GraphOrientations.js';
import VectorSet from '../../common/model/VectorSet.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import GraphControlPanel from '../../common/view/GraphControlPanel.js';
import SumCheckbox from '../../common/view/SumCheckbox.js';
import ValuesCheckbox from '../../common/view/ValuesCheckbox.js';
import VectorAdditionGridCheckbox from '../../common/view/VectorAdditionGridCheckbox.js';
import VectorAdditionViewProperties from '../../common/view/VectorAdditionViewProperties.js';
import vectorAddition from '../../vectorAddition.js';

export default class Explore1DGraphControlPanel extends GraphControlPanel {

  /**
   * @param {VectorSet} horizontalVectorSet
   * @param {VectorSet} verticalVectorSet
   * @param {VectorAdditionViewProperties} viewProperties
   * @param {Object} [options]
   */
  constructor( horizontalVectorSet, verticalVectorSet, viewProperties, options ) {

    assert && assert( horizontalVectorSet instanceof VectorSet, `invalid horizontalVectorSet: ${horizontalVectorSet}` );
    assert && assert( verticalVectorSet instanceof VectorSet, `invalid verticalVectorSet: ${verticalVectorSet}` );
    assert && assert( viewProperties instanceof VectorAdditionViewProperties, `invalid viewProperties: ${viewProperties}` );

    const horizontalSumCheckbox = new SumCheckbox( horizontalVectorSet.sumVisibleProperty,
      horizontalVectorSet.vectorColorPalette );

    const verticalSumCheckbox = new SumCheckbox( verticalVectorSet.sumVisibleProperty,
      verticalVectorSet.vectorColorPalette );

    // Show the Sum checkbox that matches the selected scene.
    // unlink is unnecessary, exists for the lifetime of the sim.
    viewProperties.graphOrientationProperty.link( gridOrientation => {
      horizontalSumCheckbox.visible = ( gridOrientation === GraphOrientations.HORIZONTAL );
      verticalSumCheckbox.visible = ( gridOrientation === GraphOrientations.VERTICAL );
    } );

    // Values
    const valuesCheckbox = new ValuesCheckbox( viewProperties.valuesVisibleProperty );

    // Grid
    const gridCheckbox = new VectorAdditionGridCheckbox( viewProperties.gridVisibleProperty );

    // To make all checkboxes the same height
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
          new Node( {
            children: [
              new AlignBox( horizontalSumCheckbox, alignBoxOptions ),
              new AlignBox( verticalSumCheckbox, alignBoxOptions )
            ]
          } ),
          new AlignBox( valuesCheckbox, alignBoxOptions ),
          new AlignBox( gridCheckbox, alignBoxOptions )
        ]
      } )
    ], options );
  }
}

vectorAddition.register( 'Explore1DGraphControlPanel', Explore1DGraphControlPanel );