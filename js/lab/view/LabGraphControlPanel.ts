// Copyright 2019-2025, University of Colorado Boulder

/**
 *  LabGraphControlPanel is the graph control panel for the 'Lab' screen.
 *  It exists for the lifetime of the sim and is not intended to be disposed.
 *
 *  @author Brandon Li
 *  @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Property from '../../../../axon/js/Property.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import AlignGroup from '../../../../scenery/js/layout/constraints/AlignGroup.js';
import AlignBox from '../../../../scenery/js/layout/nodes/AlignBox.js';
import HSeparator from '../../../../scenery/js/layout/nodes/HSeparator.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Color from '../../../../scenery/js/util/Color.js';
import ComponentVectorStyle from '../../common/model/ComponentVectorStyle.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import AnglesCheckbox from '../../common/view/AnglesCheckbox.js';
import ComponentVectorStyleControl from '../../common/view/ComponentVectorStyleControl.js';
import GraphControlPanel, { GraphControlPanelOptions } from '../../common/view/GraphControlPanel.js';
import SumCheckbox from '../../common/view/SumCheckbox.js';
import ValuesCheckbox from '../../common/view/ValuesCheckbox.js';
import VectorAdditionGridCheckbox from '../../common/view/VectorAdditionGridCheckbox.js';
import VectorAdditionViewProperties from '../../common/view/VectorAdditionViewProperties.js';
import vectorAddition from '../../vectorAddition.js';
import LabGraph from '../model/LabGraph.js';
import Tandem from '../../../../tandem/js/Tandem.js';

type SelfOptions = EmptySelfOptions;

type LabGraphControlPanelOptions = SelfOptions & GraphControlPanelOptions;

export default class LabGraphControlPanel extends GraphControlPanel {

  public constructor( cartesianGraph: LabGraph,
                      polarGraph: LabGraph,
                      componentStyleProperty: EnumerationProperty<ComponentVectorStyle>,
                      sum1VisibleProperty: Property<boolean>,
                      sum2VisibleProperty: Property<boolean>,
                      viewProperties: VectorAdditionViewProperties,
                      providedOptions: LabGraphControlPanelOptions ) {

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
    const addSumCheckboxes = ( graph: LabGraph, parentTandem: Tandem ) => {

      const sum1Checkbox = new SumCheckbox( sum1VisibleProperty, graph.vectorSet1.vectorColorPalette,
        parentTandem.createTandem( 'sum1Checkbox' ) );
      const sum2Checkbox = new SumCheckbox( sum2VisibleProperty, graph.vectorSet2.vectorColorPalette,
        parentTandem.createTandem( 'sum2Checkbox' ) );

      const sumCheckboxes = new VBox( {
        children: [
          new AlignBox( sum1Checkbox, alignBoxOptions ),
          new AlignBox( sum2Checkbox, alignBoxOptions )
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
    };
    addSumCheckboxes( cartesianGraph, options.tandem.createTandem( 'cartesian' ) );
    addSumCheckboxes( polarGraph, options.tandem.createTandem( 'polar' ) );

    // Values
    const valuesCheckbox = new ValuesCheckbox( viewProperties.valuesVisibleProperty,
      options.tandem.createTandem( 'valuesCheckbox' ) );

    // Angles
    const anglesCheckbox = new AnglesCheckbox( viewProperties.anglesVisibleProperty,
      options.tandem.createTandem( 'anglesCheckbox' ) );

    // Grid
    const gridCheckbox = new VectorAdditionGridCheckbox( viewProperties.gridVisibleProperty,
      options.tandem.createTandem( 'gridCheckbox' ) );

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

      // Radio buttons for selection component vector style
      new ComponentVectorStyleControl( componentStyleProperty, options.tandem.createTandem( 'componentVectorStyleControl' ) )

    ], options );
  }
}

vectorAddition.register( 'LabGraphControlPanel', LabGraphControlPanel );