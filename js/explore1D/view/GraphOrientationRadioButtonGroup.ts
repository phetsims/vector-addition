// Copyright 2019-2025, University of Colorado Boulder

/**
 * Radio button group for switching between the Vertical and Horizontal graph.
 *
 * @author Brandon Li
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import { EmptySelfOptions, optionize4 } from '../../../../phet-core/js/optionize.js';
import { NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupItem, RectangularRadioButtonGroupOptions } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import GraphOrientation from '../../common/model/GraphOrientation.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import VectorAdditionIconFactory from '../../common/view/VectorAdditionIconFactory.js';
import vectorAddition from '../../vectorAddition.js';

type SelfOptions = EmptySelfOptions;

type GraphOrientationRadioButtonGroupOptions = SelfOptions & NodeTranslationOptions;

export default class GraphOrientationRadioButtonGroup extends RectangularRadioButtonGroup<GraphOrientation> {

  public constructor( graphOrientationProperty: EnumerationProperty<GraphOrientation>,
                      providedOptions?: GraphOrientationRadioButtonGroupOptions ) {

    const options = optionize4<GraphOrientationRadioButtonGroupOptions, SelfOptions, RectangularRadioButtonGroupOptions>()(
      {}, VectorAdditionConstants.RADIO_BUTTON_GROUP_OPTIONS, {
        isDisposable: false
      }, providedOptions );

    // Create the description of the buttons
    const items: RectangularRadioButtonGroupItem<GraphOrientation>[] = [];
    [ GraphOrientation.HORIZONTAL, GraphOrientation.VERTICAL ].forEach( graphOrientation => {
      items.push( {
        value: graphOrientation,
        createNode: () => VectorAdditionIconFactory.createGraphOrientationIcon( graphOrientation )
      } );
    } );

    super( graphOrientationProperty, items, options );
  }
}

vectorAddition.register( 'GraphOrientationRadioButtonGroup', GraphOrientationRadioButtonGroup );