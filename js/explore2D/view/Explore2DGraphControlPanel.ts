// Copyright 2019-2023, University of Colorado Boulder

/**
 * Explore1DGraphControlPanel is the graph control panel for the 'Explore 2D' screen.
 * It exists for the lifetime of the sim and is not intended to be disposed.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import { AlignBox, AlignGroup, Color, HSeparator, Node, VBox } from '../../../../scenery/js/imports.js';
import CoordinateSnapModes from '../../common/model/CoordinateSnapModes.js';
import VectorSet from '../../common/model/VectorSet.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import AnglesCheckbox from '../../common/view/AnglesCheckbox.js';
import ComponentStyleControl from '../../common/view/ComponentStyleControl.js';
import GraphControlPanel, { GraphControlPanelOptions } from '../../common/view/GraphControlPanel.js';
import SumCheckbox from '../../common/view/SumCheckbox.js';
import ValuesCheckbox from '../../common/view/ValuesCheckbox.js';
import VectorAdditionGridCheckbox from '../../common/view/VectorAdditionGridCheckbox.js';
import VectorAdditionViewProperties from '../../common/view/VectorAdditionViewProperties.js';
import vectorAddition from '../../vectorAddition.js';
import ComponentVectorStyles from '../../common/model/ComponentVectorStyles.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

type SelfOptions = EmptySelfOptions;

type Explore2DGraphControlPanelOptions = SelfOptions & GraphControlPanelOptions;

export default class Explore2DGraphControlPanel extends GraphControlPanel {

  public constructor( cartesianVectorSet: VectorSet,
                      polarVectorSet: VectorSet,
                      componentStyleProperty: EnumerationProperty<ComponentVectorStyles>,
                      viewProperties: VectorAdditionViewProperties,
                      providedOptions?: Explore2DGraphControlPanelOptions ) {

    const options = providedOptions;

    const cartesianSumCheckbox = new SumCheckbox( cartesianVectorSet.sumVisibleProperty,
      cartesianVectorSet.vectorColorPalette );

    const polarSumCheckbox = new SumCheckbox( polarVectorSet.sumVisibleProperty,
      polarVectorSet.vectorColorPalette );

    // Show the Sum checkbox that matches the selected scene.
    // unlink is unnecessary, exists for the lifetime of the sim.
    viewProperties.coordinateSnapModeProperty.link( coordinateSnapMode => {
      polarSumCheckbox.visible = ( coordinateSnapMode === CoordinateSnapModes.POLAR );
      cartesianSumCheckbox.visible = ( coordinateSnapMode === CoordinateSnapModes.CARTESIAN );
    } );

    // Values
    const valuesCheckbox = new ValuesCheckbox( viewProperties.valuesVisibleProperty );

    // Angles
    const anglesCheckbox = new AnglesCheckbox( viewProperties.anglesVisibleProperty );

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
              new AlignBox( cartesianSumCheckbox, alignBoxOptions ),
              new AlignBox( polarSumCheckbox, alignBoxOptions )
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
      new ComponentStyleControl( componentStyleProperty, {
        maxWidth: VectorAdditionConstants.GRAPH_CONTROL_PANEL_CONTENT_WIDTH
      } )

    ], options );
  }
}

vectorAddition.register( 'Explore2DGraphControlPanel', Explore2DGraphControlPanel );