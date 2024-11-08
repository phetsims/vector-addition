// Copyright 2019-2023, University of Colorado Boulder

/**
 *  LabGraphControlPanel is the graph control panel for the 'Lab' screen.
 *  It exists for the lifetime of the sim and is not intended to be disposed.
 *
 *  @author Brandon Li
 *  @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import { AlignBox, AlignGroup, Color, HSeparator, Node, VBox } from '../../../../scenery/js/imports.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import AnglesCheckbox from '../../common/view/AnglesCheckbox.js';
import ComponentStyleControl from '../../common/view/ComponentStyleControl.js';
import GraphControlPanel, { GraphControlPanelOptions } from '../../common/view/GraphControlPanel.js';
import SumCheckbox from '../../common/view/SumCheckbox.js';
import ValuesCheckbox from '../../common/view/ValuesCheckbox.js';
import VectorAdditionGridCheckbox from '../../common/view/VectorAdditionGridCheckbox.js';
import VectorAdditionViewProperties from '../../common/view/VectorAdditionViewProperties.js';
import vectorAddition from '../../vectorAddition.js';
import LabGraph from '../model/LabGraph.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import ComponentVectorStyles from '../../common/model/ComponentVectorStyles.js';

type SelfOptions = EmptySelfOptions;

type LabGraphControlPanelOptions = SelfOptions & GraphControlPanelOptions;

export default class LabGraphControlPanel extends GraphControlPanel {

  public constructor( cartesianGraph: LabGraph,
                      polarGraph: LabGraph,
                      componentStyleProperty: EnumerationProperty<ComponentVectorStyles>,
                      sum1VisibleProperty: Property<boolean>,
                      sum2VisibleProperty: Property<boolean>,
                      viewProperties: VectorAdditionViewProperties,
                      providedOptions?: LabGraphControlPanelOptions ) {

    const options = providedOptions;

    // To make all checkboxes the same height
    const alignBoxOptions = {
      group: new AlignGroup( {
        matchHorizontal: false,
        matchVertical: true
      } )
    };

    // Create two 'Sum' checkboxes for each graph
    const sumCheckboxContainer = new Node();
    [ cartesianGraph, polarGraph ].forEach( graph => {

      const sumCheckboxes = new VBox( {
        children: [
          new AlignBox( new SumCheckbox( sum1VisibleProperty, graph.vectorSet1.vectorColorPalette ), alignBoxOptions ),
          new AlignBox( new SumCheckbox( sum2VisibleProperty, graph.vectorSet2.vectorColorPalette ), alignBoxOptions )
        ],
        spacing: VectorAdditionConstants.CHECKBOX_Y_SPACING,
        align: 'left'
      } );
      sumCheckboxContainer.addChild( sumCheckboxes );

      // Show the Sum checkboxes that match the selected scene.
      // unlink is unnecessary, exists for the lifetime of the sim.
      viewProperties.coordinateSnapModeProperty.link( coordinateSnapMode => {
        sumCheckboxes.visible = ( coordinateSnapMode === graph.coordinateSnapMode );
      } );
    } );

    // Values
    const valuesCheckbox = new ValuesCheckbox( viewProperties.valuesVisibleProperty );

    // Angles
    const anglesCheckbox = new AnglesCheckbox( viewProperties.anglesVisibleProperty );

    // Grid
    const gridCheckbox = new VectorAdditionGridCheckbox( viewProperties.gridVisibleProperty );

    super( [

      // checkboxes, wrapped with AlignBox so that they are all the same height
      new VBox( {
        spacing: VectorAdditionConstants.CHECKBOX_Y_SPACING,
        align: 'left',
        children: [
          sumCheckboxContainer,
          new AlignBox( valuesCheckbox, alignBoxOptions ),
          new AlignBox( anglesCheckbox, alignBoxOptions ),
          new AlignBox( gridCheckbox, alignBoxOptions )
        ]
      } ),

      // separator
      new HSeparator( { stroke: Color.BLACK } ),

      // Components radio buttons
      new ComponentStyleControl( componentStyleProperty )

    ], options );
  }
}

vectorAddition.register( 'LabGraphControlPanel', LabGraphControlPanel );