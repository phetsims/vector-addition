// Copyright 2025, University of Colorado Boulder

/**
 * LabSceneNode displays a scene for the 'Explore 2D' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import SceneNode from '../../common/view/SceneNode.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import LabVectorCreatorPanel from './LabVectorCreatorPanel.js';
import vectorAddition from '../../vectorAddition.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import LabViewProperties from './LabViewProperties.js';
import LabGraph from '../model/LabGraph.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Node from '../../../../scenery/js/nodes/Node.js';

export default class LabSceneNode extends SceneNode {

  public constructor( graph: LabGraph,
                      viewProperties: LabViewProperties,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      graphOrientationRadioButtonGroup: Node, // for layout
                      tandem: Tandem ) {

    super( graph, viewProperties, componentVectorStyleProperty, {
      visibleProperty: new DerivedProperty( [ viewProperties.coordinateSnapModeProperty ],
        graphOrientation => graphOrientation === graph.coordinateSnapMode ),
      tandem: tandem
    } );

    // Add the vector creator panel
    this.addVectorCreatorPanel( new LabVectorCreatorPanel( graph, this, {
      left: graphOrientationRadioButtonGroup.left,
      bottom: graphOrientationRadioButtonGroup.top - VectorAdditionConstants.RADIO_BUTTONS_Y_SPACING,
      tandem: tandem.createTandem( 'vectorCreatorPanel' )
    } ) );
  }
}

vectorAddition.register( 'LabSceneNode', LabSceneNode );