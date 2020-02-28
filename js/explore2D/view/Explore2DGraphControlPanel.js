// Copyright 2019-2020, University of Colorado Boulder

/**
 * Explore1DGraphControlPanel is the graph control panel for the 'Explore 2D' screen.
 * It exists for the lifetime of the sim and is not intended to be disposed.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import AlignBox from '../../../../scenery/js/nodes/AlignBox.js';
import AlignGroup from '../../../../scenery/js/nodes/AlignGroup.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Color from '../../../../scenery/js/util/Color.js';
import HSeparator from '../../../../sun/js/HSeparator.js';
import CoordinateSnapModes from '../../common/model/CoordinateSnapModes.js';
import VectorSet from '../../common/model/VectorSet.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import AnglesCheckbox from '../../common/view/AnglesCheckbox.js';
import ComponentStyleControl from '../../common/view/ComponentStyleControl.js';
import GraphControlPanel from '../../common/view/GraphControlPanel.js';
import SumCheckbox from '../../common/view/SumCheckbox.js';
import ValuesCheckbox from '../../common/view/ValuesCheckbox.js';
import VectorAdditionGridCheckbox from '../../common/view/VectorAdditionGridCheckbox.js';
import VectorAdditionViewProperties from '../../common/view/VectorAdditionViewProperties.js';
import vectorAddition from '../../vectorAddition.js';

class Explore2DGraphControlPanel extends GraphControlPanel {

  /**
   * @param {VectorSet} cartesianVectorSet
   * @param {VectorSet} polarVectorSet
   * @param {EnumerationProperty.<ComponentVectorStyles>} componentStyleProperty
   * @param {VectorAdditionViewProperties} viewProperties
   * @param {Object} [options]
   */
  constructor( cartesianVectorSet, polarVectorSet, componentStyleProperty, viewProperties, options ) {

    assert && assert( cartesianVectorSet instanceof VectorSet, `invalid cartesianVectorSet: ${cartesianVectorSet}` );
    assert && assert( polarVectorSet instanceof VectorSet, `invalid polarVectorSet: ${polarVectorSet}` );
    assert && assert( componentStyleProperty instanceof EnumerationProperty, `invalid componentStyleProperty: ${componentStyleProperty}` );
    assert && assert( viewProperties instanceof VectorAdditionViewProperties, `invalid viewProperties: ${viewProperties}` );

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
      new HSeparator( VectorAdditionConstants.GRAPH_CONTROL_PANEL_CONTENT_WIDTH, {
        stroke: Color.BLACK
      } ),

      // Components radio buttons
      new ComponentStyleControl( componentStyleProperty, {
        maxWidth: VectorAdditionConstants.GRAPH_CONTROL_PANEL_CONTENT_WIDTH
      } )

    ], options );
  }
}

vectorAddition.register( 'Explore2DGraphControlPanel', Explore2DGraphControlPanel );
export default Explore2DGraphControlPanel;