// Copyright 2019-2025, University of Colorado Boulder

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

  // whether the EquationAccordionBoxBox is expanded
  public readonly equationAccordionBoxExpandedProperty: Property<boolean>;

  // whether the BaseVectorsAccordionBox is expanded
  public readonly baseVectorsAccordionBoxExpandedProperty: Property<boolean>;

  // whether base vectors are visible on the graph
  public readonly baseVectorsVisibleProperty: Property<boolean>;

  public constructor( tandem: Tandem ) {
    super( {
      tandem: tandem
    } );

    this.equationAccordionBoxExpandedProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'equationAccordionBoxExpandedProperty' )
    } );

    this.baseVectorsAccordionBoxExpandedProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'baseVectorsAccordionBoxExpandedProperty' )
    } );

    this.baseVectorsVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'baseVectorsVisibleProperty' )
    } );
  }

  public override reset(): void {
    super.reset();
    this.equationAccordionBoxExpandedProperty.reset();
    this.baseVectorsAccordionBoxExpandedProperty.reset();
    this.baseVectorsVisibleProperty.reset();
  }
}

vectorAddition.register( 'EquationsViewProperties', EquationsViewProperties );