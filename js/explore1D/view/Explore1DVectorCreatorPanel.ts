// Copyright 2019-2025, University of Colorado Boulder

/**
 * Explore1DVectorCreatorPanel is a specialization of VectorCreatorPanel (the vector 'toolbox') for the 'Explore 1D' screen.
 *
 * @author Brandon Li
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import VectorAdditionSceneNode from '../../common/view/VectorAdditionSceneNode.js';
import VectorCreatorPanel, { VectorCreatorPanelOptions } from '../../common/view/VectorCreatorPanel.js';
import VectorCreatorPanelSlot from '../../common/view/VectorCreatorPanelSlot.js';
import vectorAddition from '../../vectorAddition.js';
import Explore1DScene from '../model/Explore1DScene.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Explore1DVectorCreatorPanelSlot from './Explore1DVectorCreatorPanelSlot.js';

type SelfOptions = EmptySelfOptions;

type Explore1DVectorCreatorPanelOptions = SelfOptions & StrictOmit<VectorCreatorPanelOptions, 'ySpacing'>;

export default class Explore1DVectorCreatorPanel extends VectorCreatorPanel {

  /**
   * @param scene
   * @param sceneNode
   * @param providedOptions
   */
  public constructor( scene: Explore1DScene,
                      sceneNode: VectorAdditionSceneNode,
                      providedOptions: Explore1DVectorCreatorPanelOptions ) {

    const options = optionize<Explore1DVectorCreatorPanelOptions, SelfOptions, VectorCreatorPanelOptions>()( {

      // VectorCreatorPanelOptions
      ySpacing: ( scene.graph.orientation === 'horizontal' ) ? 32 : 18
    }, providedOptions );

    // Create a slot for each vector.
    const panelSlots: VectorCreatorPanelSlot[] = [];
    scene.vectors.forEach( vector => {
      panelSlots.push( new Explore1DVectorCreatorPanelSlot( vector, scene, scene.vectorSet, sceneNode,
        options.tandem.createTandem( `${vector.tandemNameSymbol}Slot` ) ) );
    } );

    super( panelSlots, options );
  }
}

vectorAddition.register( 'Explore1DVectorCreatorPanel', Explore1DVectorCreatorPanel );