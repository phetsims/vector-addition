// Copyright 2019-2025, University of Colorado Boulder

/**
 * LabVectorCreatorPanel is a specialization of VectorCreatorPanel (the vector 'toolbox') for the 'Lab' screen.
 *
 * @author Brandon Li
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import SceneNode from '../../common/view/SceneNode.js';
import VectorCreatorPanel, { VectorCreatorPanelOptions } from '../../common/view/VectorCreatorPanel.js';
import VectorCreatorPanelSlot from '../../common/view/VectorCreatorPanelSlot.js';
import vectorAddition from '../../vectorAddition.js';
import LabScene from '../model/LabScene.js';
import { toRadians } from '../../../../dot/js/util/toRadians.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';

type SelfOptions = EmptySelfOptions;

type LabVectorCreatorPanelOptions = SelfOptions & StrictOmit<VectorCreatorPanelOptions, 'slotSpacing'>;

export default class LabVectorCreatorPanel extends VectorCreatorPanel {

  public constructor( graph: LabScene, sceneNode: SceneNode, providedOptions: LabVectorCreatorPanelOptions ) {

    const options = optionize<LabVectorCreatorPanelOptions, SelfOptions, VectorCreatorPanelOptions>()( {

      // VectorCreatorPanelOptions
      slotSpacing: 40
    }, providedOptions );

    // Create the initial vector components, the same for all vectors in a set.
    // See https://github.com/phetsims/vector-addition/issues/227
    const initialVectorComponents = ( graph.coordinateSnapMode === 'cartesian' ) ?
                                    new Vector2( 8, 6 ) :
                                    Vector2.createPolar( 8, toRadians( 45 ) );

    // Create a slot for each VectorSet
    const slots: VectorCreatorPanelSlot[] = [];
    graph.vectorSets.forEach( vectorSet => {
      slots.push( new VectorCreatorPanelSlot( graph, vectorSet, sceneNode, initialVectorComponents, {
        iconArrowMagnitude: 57,
        numberOfVectors: 10 // Each slot can create 10 vectors
      } ) );
    } );

    super( slots, options );
  }
}

vectorAddition.register( 'LabVectorCreatorPanel', LabVectorCreatorPanel );