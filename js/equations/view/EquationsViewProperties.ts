// Copyright 2019-2024, University of Colorado Boulder

/**
 * View-specific Properties for the 'Equations' screen. Expands on the base view Properties, and adds Properties
 * that are unique to this screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import VectorAdditionViewProperties from '../../common/view/VectorAdditionViewProperties.js';
import vectorAddition from '../../vectorAddition.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class EquationsViewProperties extends VectorAdditionViewProperties {

  // whether the EquationToggleBox is expanded
  public readonly equationExpandedProperty: Property<boolean>;

  // whether the BaseVectorsAccordionBox is expanded
  public readonly baseVectorsExpandedProperty: Property<boolean>;

  // whether base vectors are visible on the graph
  public readonly baseVectorsVisibleProperty: Property<boolean>;

  public constructor( tandem: Tandem ) {
    super( tandem );

    this.equationExpandedProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'equationExpandedProperty' )
    } );

    this.baseVectorsExpandedProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'baseVectorsExpandedProperty' )
    } );

    this.baseVectorsVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'baseVectorsVisibleProperty' )
    } );
  }

  public override reset(): void {
    super.reset();
    this.equationExpandedProperty.reset();
    this.baseVectorsExpandedProperty.reset();
    this.baseVectorsVisibleProperty.reset();
  }
}

vectorAddition.register( 'EquationsViewProperties', EquationsViewProperties );