// Copyright 2019-2023, University of Colorado Boulder

/**
 * Radio button group for switching between the Vertical and Horizontal graph.
 *
 * @author Brandon Li
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import GraphOrientations from '../../common/model/GraphOrientations.js';
import VectorAdditionConstants from '../../common/VectorAdditionConstants.js';
import VectorAdditionIconFactory from '../../common/view/VectorAdditionIconFactory.js';
import vectorAddition from '../../vectorAddition.js';

export default class GraphOrientationRadioButtonGroup extends RectangularRadioButtonGroup {

  /**
   * @param {EnumerationProperty.<GraphOrientations>} graphOrientationProperty
   * @param {Object} [options]
   */
  constructor( graphOrientationProperty, options ) {

    assert && assert( graphOrientationProperty instanceof EnumerationProperty && GraphOrientations.enumeration.includes( graphOrientationProperty.value ),
      `invalid graphOrientationProperty: ${graphOrientationProperty}` );
    assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype, `Extra prototype on options: ${options}` );

    options = merge( {}, VectorAdditionConstants.RADIO_BUTTON_GROUP_OPTIONS, options );

    // Create the description of the buttons
    const content = [];
    [ GraphOrientations.HORIZONTAL, GraphOrientations.VERTICAL ].forEach( graphOrientation => {
      content.push( {
        value: graphOrientation,
        createNode: () => VectorAdditionIconFactory.createGraphOrientationIcon( graphOrientation )
      } );
    } );

    super( graphOrientationProperty, content, options );
  }
}

vectorAddition.register( 'GraphOrientationRadioButtonGroup', GraphOrientationRadioButtonGroup );