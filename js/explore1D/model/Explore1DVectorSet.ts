// Copyright 2025, University of Colorado Boulder

/**
 * Explore1DVectorSet is a specialization of VectorSet for the 'Explore 1D' screen.
 * In this screen, there is 1 instance of each vector, labeled 'a', 'b', and 'c'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import { ComponentVectorStyle } from '../../common/model/ComponentVectorStyle.js';
import VectorColorPalette from '../../common/model/VectorColorPalette.js';
import VectorSet from '../../common/model/VectorSet.js';
import vectorAddition from '../../vectorAddition.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import VectorAdditionSymbols from '../../common/VectorAdditionSymbols.js';
import Vector from '../../common/model/Vector.js';
import Explore1DScene from './Explore1DScene.js';
import Vector2 from '../../../../dot/js/Vector2.js';

export default class Explore1DVectorSet extends VectorSet {

  // The 3 vectors supported by the Explore 1D screen.
  public readonly aVector: Vector;
  public readonly bVector: Vector;
  public readonly cVector: Vector;

  public constructor( scene: Explore1DScene,
                      componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                      vectorColorPalette: VectorColorPalette,
                      tandem: Tandem ) {

    const options = {
      tandem: tandem
    };

    super( scene, componentVectorStyleProperty, vectorColorPalette, options );

    const isHorizontal = ( scene.graph.orientation === 'horizontal' );
    const initialVectorComponents = isHorizontal ? new Vector2( 5, 0 ) : new Vector2( 0, 5 );

    this.aVector = new Vector( Vector2.ZERO, initialVectorComponents, scene, this, VectorAdditionSymbols.aStringProperty, {
      isDisposable: false,
      tandem: tandem.createTandem( 'aVector' ),
      tandemNameSymbol: 'a'
    } );

    this.bVector = new Vector( Vector2.ZERO, initialVectorComponents, scene, this, VectorAdditionSymbols.bStringProperty, {
      isDisposable: false,
      tandem: tandem.createTandem( 'bVector' ),
      tandemNameSymbol: 'b'
    } );

    this.cVector = new Vector( Vector2.ZERO, initialVectorComponents, scene, this, VectorAdditionSymbols.cStringProperty, {
      isDisposable: false,
      tandem: tandem.createTandem( 'cVector' ),
      tandemNameSymbol: 'c'
    } );
  }

  public override reset(): void {
    this.aVector.reset();
    this.bVector.reset();
    this.cVector.reset();
    this.vectors.clear(); // Clear before calling super.reset, which will call dispose for contents of this.vectors.
    super.reset();
  }
}

vectorAddition.register( 'Explore1DVectorSet', Explore1DVectorSet );