// Copyright 2019-2023, University of Colorado Boulder

/**
 * Radio button group for switching between the Vertical and Horizontal graph.
 *
 * @author Brandon Li
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupItem, RectangularRadioButtonGroupOptions } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import GraphOrientations from '../../common/model/GraphOrientations.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import VectorAdditionIconFactory from '../../common/view/VectorAdditionIconFactory.js';
import vectorAddition from '../../vectorAddition.js';
import { EmptySelfOptions, optionize4 } from '../../../../phet-core/js/optionize.js';
import { NodeTranslationOptions } from '../../../../scenery/js/imports.js';

type SelfOptions = EmptySelfOptions;

type GraphOrientationRadioButtonGroupOptions = SelfOptions & NodeTranslationOptions;

export default class GraphOrientationRadioButtonGroup extends RectangularRadioButtonGroup<GraphOrientations> {

  public constructor( graphOrientationProperty: EnumerationProperty<GraphOrientations>,
                      providedOptions?: GraphOrientationRadioButtonGroupOptions ) {

    const options = optionize4<GraphOrientationRadioButtonGroupOptions, SelfOptions, RectangularRadioButtonGroupOptions>()(
      {}, VectorAdditionConstants.RADIO_BUTTON_GROUP_OPTIONS, {
        isDisposable: false
      }, providedOptions );

    // Create the description of the buttons
    const items: RectangularRadioButtonGroupItem<GraphOrientations>[] = [];
    [ GraphOrientations.HORIZONTAL, GraphOrientations.VERTICAL ].forEach( graphOrientation => {
      items.push( {
        value: graphOrientation,
        createNode: () => VectorAdditionIconFactory.createGraphOrientationIcon( graphOrientation )
      } );
    } );

    super( graphOrientationProperty, items, options );
  }
}

vectorAddition.register( 'GraphOrientationRadioButtonGroup', GraphOrientationRadioButtonGroup );