// Copyright 2019-2023, University of Colorado Boulder

/**
 * View-specific Properties for the 'Equations' screen. Expands on the base view Properties, and adds Properties
 * that are unique to this screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import VectorAdditionViewProperties from '../../common/view/VectorAdditionViewProperties.js';
import vectorAddition from '../../vectorAddition.js';

export default class EquationsViewProperties extends VectorAdditionViewProperties {

  constructor() {
    super();

    // @public whether the EquationToggleBox is expanded
    this.equationExpandedProperty = new BooleanProperty( true );

    // @public whether the BaseVectorsAccordionBox is expanded
    this.baseVectorsExpandedProperty = new BooleanProperty( false );

    // @public whether base vectors are visible on the graph
    this.baseVectorsVisibleProperty = new BooleanProperty( false );
  }

  /**
   * @public
   * @override
   */
  reset() {
    super.reset();
    this.equationExpandedProperty.reset();
    this.baseVectorsExpandedProperty.reset();
    this.baseVectorsVisibleProperty.reset();
  }
}

vectorAddition.register( 'EquationsViewProperties', EquationsViewProperties );